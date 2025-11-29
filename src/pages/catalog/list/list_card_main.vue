<script setup lang="ts">
// vue
import { ref, computed, onMounted } from "vue";

// router & pinia
import { useGlobalState } from "../../../helper/pinia";
const global = useGlobalState();
import { addToBasket, addToFavourites, removeFromFavourites } from "../../../helper/actions";
import router from "../../../helper/router";
function navigateToProduct() { router.push(`/product/${props.data.id}`) };

// props
const props = defineProps<{ data: any }>();
const active_color = ref(0);

// монтирование
onMounted(() => { active_color.value = props.data.displayColor ?? 0 });

// Функция для получения переведенной валюты
function getTranslatedRub() {
  const value = getComputedStyle(document.documentElement).getPropertyValue('--rub');
  return value ? value.replace(/^"(.*)"$/, '$1') : 'rub';
}

// vars
const activeColorData = computed(() => props.data.colors?.[active_color.value]);
const isFavourite = computed(() => 
  global.user?.favourite?.some((f) => 
    f.id === props.data.id && 
    f.color === activeColorData.value?.name && 
    f.size === "42.0"
  ) ?? false
);

// добавление в корзину
async function handleAddToBasket(event: Event) {
  event.stopPropagation();
  try {
    await addToBasket({
      id: props.data.id,
      color: props.data.colors[active_color.value].name,
      size: "42.0",
    });
    alert("Товар успешно добавлен в корзину!");
  } catch (err: any) {
    console.error(err);
    alert("Не удалось добавить товар в корзину");
  }
}

// добавление в избранное
async function toggleFavourite(event: Event) {
  event.stopPropagation();
  try {
    const item = {
      id: props.data.id,
      color: props.data.colors[active_color.value].name,
      size: "42.0",
    };
    if (isFavourite.value) {
      await removeFromFavourites(item);
      alert("Удалено из избранного!");
    } else {
      await addToFavourites(item);
      alert("Добавлено в избранное!");
    }
  } catch (err: any) {
    console.error(err);
    alert("Ошибка при изменении избранного");
  }
}

// смена выбранного цвета
function setActiveColor(val: number, event: Event) { event.stopPropagation(); active_color.value = val; }
</script>

<template>
  <div class="card" @click="navigateToProduct">
    <div class="img-holder">
      <div class="color-wrapper">
        <button 
          v-for="(value, index) in props.data.colors" 
          v-if="props.data.colors.length !== 1" 
          :key="index" 
          class="color" 
          :style="{ background: value.folder_name }" 
          @click="setActiveColor(index, $event)"
        ></button>
        <div class="rating">{{ props.data.rating }} / 100</div>
      </div>
      <img 
        v-if="props.data.colors[active_color]" 
        :src="`./sneakers/${props.data.id}-${props.data.colors[active_color].folder_name}/1.jpg`" 
        alt="product img" 
      />
      <img 
        v-if="props.data.colors[active_color]" 
        :src="`./sneakers/${props.data.id}-${props.data.colors[active_color].folder_name}/0.jpg`" 
        alt="product img" 
        class="dis" 
      />
    </div>
    <p class="name">{{ props.data.name }}</p>
    <p class="sub-name">{{ props.data.colors[active_color].name }}</p>
    <div class="tags-holder">
      <div class="tag">{{ props.data.brand }}</div>
      <div class="tag">{{ props.data.gender }}</div>
    </div>
    <div class="duo">
      <button 
        class="btn" 
        v-if="global.user" 
        :disabled="global.user.id === 'filler'" 
        @click="handleAddToBasket"
      >
        {{ `${props.data.cost} ${getTranslatedRub()}` }}
      </button>
      <button 
        class="fav" 
        v-if="global.user" 
        :disabled="global.user.id === 'filler'" 
        @click="toggleFavourite"
      >
        <img src="/public/svg/heart.svg" :class="{ active: isFavourite }" />
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.card {
  height: fit-content;
  background: var(--bg-c);
  padding: 1rem;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }

  .name {
    font-size: 1rem;
    font-weight: 700;
    color: var(--text-a);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .img-holder {
    width: 100%;
    aspect-ratio: 6 / 5;
    position: relative;
    overflow: hidden;
    display: flex;

    .color-wrapper {
      width: 100%;
      height: fit-content;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.25rem;
      position: relative;
      z-index: 2;

      .color {
        height: 1rem;
        aspect-ratio: 1 / 1;
        border-radius: 0.375rem;
        border: 1px solid var(--bg-d);
        cursor: pointer;
        transition: transform 0.2s ease;

        &:hover {
          transform: scale(1.1);
        }
      }

      .rating {
        font-size: 0.8rem;
        color: var(--text-a);
        background: var(--bg-d);
        padding: 0.2rem 0.5rem;
        margin-left: auto;
        border-radius: 0.5rem;
        white-space: nowrap;
      }
    }

    img {
      width: 100%;
      position: absolute;
      left: 0;
      bottom: 0;
      transition: 0.4s;
      object-fit: cover;
    }

    .dis:hover {
      opacity: 0;
    }
  }

  .sub-name {
    font-size: 0.8rem;
    color: var(--text-b);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .tags-holder {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;

    .tag {
      font-size: 0.8rem;
      color: var(--text-c);
      background: var(--bg-d);
      padding: 0.2rem 0.5rem;
      border-radius: 0.5rem;
      color: var(--text-a);
      white-space: nowrap;
    }
  }

  .duo {
    height: 2rem;
    margin-top: 0.25rem;
    display: flex;
    gap: 0.5rem;

    .fav {
      height: 100%;
      padding: 0.25rem;
      background: var(--bg-d);
      border-radius: 0.5rem;
      aspect-ratio: 1 / 1;
      display: flex;
      justify-content: center;
      align-items: center;
      border: none;
      cursor: pointer;
      transition: background-color 0.2s ease;

      &:hover:not(:disabled) {
        background: var(--bg-b);
      }

      img {
        filter: invert(var(--svg-invert));
        transition: filter 0.2s ease;
        width: 1.2rem;
        height: 1.2rem;
      }

      img.active {
        filter: invert(0.5) sepia(1) saturate(5) hue-rotate(320deg);
      }
    }

    :disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }

    .btn {
      flex: 1;
      height: 100%;
      text-align: center;
      padding: 0.25rem 0;
      border-radius: 0.5rem;
      background: var(--text-a);
      color: var(--bg-a);
      cursor: pointer;
      border: none;
      font-weight: 600;
      transition: background-color 0.2s ease;

      &:hover:not(:disabled) {
        background: var(--text-b);
      }
    }
    
    :disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }
}

/* Адаптация для планшетов */
@media (max-width: 1024px) {
  .card {
    padding: 0.8rem;
    gap: 0.2rem;

    .name {
      font-size: 0.9rem;
    }

    .img-holder {
      .color-wrapper {
        gap: 0.4rem;
        padding: 0.2rem;

        .color {
          height: 0.9rem;
        }

        .rating {
          font-size: 0.7rem;
          padding: 0.15rem 0.4rem;
        }
      }
    }

    .sub-name {
      font-size: 0.75rem;
    }

    .tags-holder .tag {
      font-size: 0.75rem;
      padding: 0.15rem 0.4rem;
    }

    .duo {
      height: 1.8rem;
      
      .fav img {
        width: 1rem;
        height: 1rem;
      }
    }
  }
}

/* Адаптация для телефонов */
@media (max-width: 768px) {
  .card {
    padding: 0.6rem;

    .name {
      font-size: 0.85rem;
    }

    .img-holder {
      .color-wrapper {
        gap: 0.3rem;

        .color {
          height: 0.8rem;
        }

        .rating {
          font-size: 0.65rem;
          padding: 0.1rem 0.3rem;
        }
      }
    }

    .sub-name {
      font-size: 0.7rem;
    }

    .tags-holder .tag {
      font-size: 0.7rem;
      padding: 0.1rem 0.3rem;
    }

    .duo {
      height: 1.6rem;
      gap: 0.4rem;
      
      .fav img {
        width: 0.9rem;
        height: 0.9rem;
      }
      
      .btn {
        font-size: 0.8rem;
      }
    }
  }
}

/* Адаптация для маленьких телефонов */
@media (max-width: 480px) {
  .card {
    padding: 0.5rem;
    border-radius: 0.8rem;

    .name {
      font-size: 0.8rem;
    }

    .img-holder {
      aspect-ratio: 5 / 4;
      
      .color-wrapper {
        .color {
          height: 0.7rem;
        }

        .rating {
          font-size: 0.6rem;
        }
      }
    }

    .sub-name {
      font-size: 0.65rem;
    }

    .tags-holder {
      gap: 0.3rem;
      
      .tag {
        font-size: 0.65rem;
        padding: 0.08rem 0.25rem;
      }
    }

    .duo {
      height: 1.4rem;
      gap: 0.3rem;
      
      .fav {
        padding: 0.2rem;
        
        img {
          width: 0.8rem;
          height: 0.8rem;
        }
      }
      
      .btn {
        font-size: 0.75rem;
        padding: 0.2rem 0;
      }
    }
  }
}
</style>
