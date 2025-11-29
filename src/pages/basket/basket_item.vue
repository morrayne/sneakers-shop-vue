<script setup lang="ts">
// vue
import { ref } from "vue";

// pinia 
import { useGlobalState } from "../../helper/pinia";
import { updateUserField } from "../../helper/actions";
const global = useGlobalState();

// types
interface Color {
  name: string;
  folder_name: string;
}
interface BasketItem {
  id: number;
  name: string;
  favouriteColor: number;
  favouriteSize: string;
  colors: Color[];
  gender: string;
  rating: number;
  cost: number;
}

// props & emits
const props = defineProps<{ data: BasketItem }>();
const emit = defineEmits<{ "item-removed": [id: number, colorIndex: number, size: string] }>();

// Функция для получения переведенной валюты
function getTranslatedRub() {
  const value = getComputedStyle(document.documentElement).getPropertyValue('--rub');
  return value ? value.replace(/^"(.*)"$/, '$1') : 'rub';
}

// vars
const loading = ref(false);

// функция удаления из корзины
async function removeFromBasket() {
  if (loading.value) return;
  loading.value = true;
  try {
    const { id, favouriteColor, favouriteSize, colors } = props.data;
    const colorName = colors[favouriteColor]?.name ?? "";
    
    if (!global.user) throw new Error("Пользователь не инициализирован");
    
    const updatedBasket = global.user.basket.filter((item) => {
      const sameId = item.id === id;
      const sameSize = item.size === favouriteSize;
      
      // Простое сравнение цвета - если color это число, сравниваем числа, если строка - сравниваем строки
      const sameColor = typeof item.color === "number" 
        ? item.color === favouriteColor
        : item.color === colorName;
      
      return !(sameId && sameSize && sameColor);
    });
    
    await updateUserField("basket", updatedBasket);
    emit("item-removed", id, favouriteColor, favouriteSize);
  } catch (err: any) {
    console.error("❌ Ошибка при удалении:", err.message ?? err);
    alert("Не удалось удалить товар");
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="item" v-if="props.data">
    <div class="img-wrapper">
      <img :src="`/sneakers/${props.data.id}-${props.data.colors[props.data.favouriteColor]?.folder_name || props.data.colors[0]?.folder_name}/0.jpg`" :alt="props.data.name" />
      <button class="bin" @click="removeFromBasket" :disabled="loading">
        <img src="/public/svg/bin.svg" alt="Delete" />
      </button>
      <div class="tag">{{ props.data.colors[props.data.favouriteColor]?.name }}</div>
    </div>
    <div class="details">
      <div class="name">{{ props.data.name }}</div>
      <div class="stags">
        <div class="stag">{{ props.data.gender }}</div>
        <div class="stag">{{ props.data.favouriteSize }}</div>
        <div class="stag">{{ props.data.rating }} / 100</div>
      </div>
      <div class="movetobasket">{{ props.data.cost }} {{ getTranslatedRub() }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.item {
  height: fit-content;
  border-radius: 1rem;
  background: var(--bg-c);
  display: flex;
  flex-direction: column;
  padding: 1rem;

  .img-wrapper {
    aspect-ratio: 6 / 5;
    position: relative;
    overflow: hidden;

    .bin {
      width: 2rem;
      height: 2rem;
      background: var(--bg-d);
      border-radius: 0.25rem;
      padding: 0.25rem;
      position: absolute;
      top: 0.25rem;
      right: 0.25rem;
      z-index: 2;
      cursor: pointer;

      img {
        width: 1.5rem;
        aspect-ratio: 1 / 1;
        margin: 0.25rem;
        filter: invert(var(--svg-invert));
      }
    }

    img {
      position: absolute;
      bottom: 0;
      left: 0;
    }
  }

  .sdf {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    padding: 0.2rem 0.5rem;
    border-radius: 0.35rem;
    text-align: center;
    font-size: 0.8rem;
    color: var(--text-a);
    background: var(--bg-d);
  }

  .stags {
    display: flex;
    gap: 0.5rem;
    margin: 0 0 0.5rem;
    white-space: nowrap;

    .stag {
      padding: 0.2rem 0.5rem;
      border-radius: 0.35rem;
      text-align: center;
      font-size: 0.8rem;
      color: var(--text-a);
      background: var(--bg-d);
    }
  }

  .name {
    margin: 0.5rem 0;
  }

  .movetobasket {
    width: 100%;
    border-radius: 0.5rem;
    text-align: center;
    padding: 0.35rem 0;
    background: var(--text-a);
    color: var(--bg-a);
    cursor: pointer;
  }
}

/* Планшеты */
@media (max-width: 1024px) {
  .item {
    padding: 0.8rem;

    .img-wrapper .bin {
      width: 1.8rem;
      height: 1.8rem;
      
      img {
        width: 1.3rem;
      }
    }

    .sdf {
      font-size: 0.75rem;
      padding: 0.15rem 0.4rem;
    }

    .stags {
      gap: 0.4rem;
      
      .stag {
        font-size: 0.75rem;
        padding: 0.15rem 0.4rem;
      }
    }

    .movetobasket {
      padding: 0.3rem 0;
      font-size: 0.9rem;
    }
  }
}

/* Маленькие планшеты */
@media (max-width: 768px) {
  .item {
    padding: 0.6rem;
    border-radius: 0.8rem;

    .img-wrapper .bin {
      width: 1.6rem;
      height: 1.6rem;
      top: 0.2rem;
      right: 0.2rem;
      
      img {
        width: 1.1rem;
      }
    }

    .sdf {
      font-size: 0.7rem;
      padding: 0.1rem 0.3rem;
    }

    .stags {
      gap: 0.3rem;
      
      .stag {
        font-size: 0.7rem;
        padding: 0.1rem 0.3rem;
      }
    }

    .movetobasket {
      padding: 0.25rem 0;
      font-size: 0.8rem;
    }
  }
}

/* Телефоны */
@media (max-width: 480px) {
  .item {
    padding: 0.5rem;

    .img-wrapper .bin {
      width: 1.4rem;
      height: 1.4rem;
      
      img {
        width: 1rem;
      }
    }

    .sdf {
      font-size: 0.65rem;
      padding: 0.08rem 0.25rem;
    }

    .stags {
      gap: 0.25rem;
      
      .stag {
        font-size: 0.65rem;
        padding: 0.08rem 0.25rem;
      }
    }

    .movetobasket {
      padding: 0.2rem 0;
      font-size: 0.75rem;
    }
  }
}
</style>
