<script setup lang="ts">
// vue
import { ref, computed } from "vue";

// props & emits
const props = defineProps<{ 
  data: product_item; 
  sneaker: sneaker_item | null
}>();
const emit = defineEmits<{
  (e: 'item-removed', item: product_item): void
  (e: 'size-changed', item: product_item, newSize: string): void
}>();

// pinia & supabase
import { useGlobalState } from "../../helper/pinia";
import { updateUserField } from "../../helper/actions";
const global = useGlobalState();

// types & vars
import type { product_item, sneaker_item, sneaker_color } from "../../helper/types";
const sizes = ["40.0","40.5","41.0","41.5","42.0","42.5","43.0","43.5","44.0"];
const selectedSize = ref(props.data.size || sizes[0]);
const loading = ref(false);
const selectedFolder = computed((): sneaker_color | undefined => { return props.sneaker?.colors?.find((c: sneaker_color) => c.name === props.data.color) });

// удаление из избранного
function removeFromFavourite(): void {
  emit('item-removed', props.data);
}

// перевыбор размера
async function selectSize(size: string): Promise<void> {
  if (size === selectedSize.value || loading.value || !global.user) return;
  loading.value = true;
  try {
    selectedSize.value = size;
    const updatedItem: product_item = { ...props.data, size: size };
    const updatedFavourite: product_item[] = global.user.favourite.map((item: product_item) => item.id === props.data.id && item.color === props.data.color ? updatedItem : item);
    if (global.user.id !== "Guest") {
      await updateUserField("favourite", updatedFavourite);
    } else {
      global.user.favourite = updatedFavourite;
    }
    emit('size-changed', updatedItem, size);
  } catch (err) {
    console.error("❌ Ошибка при изменении размера:", err);
  } finally {
    loading.value = false;
  }
}

// перемещение в корзину
async function moveToBasket(): Promise<void> {
  if (loading.value || !global.user) return;
  loading.value = true;
  try {
    const basketItem: product_item = { id: props.data.id, color: props.data.color, size: selectedSize.value! };
    const currentBasket: product_item[] = global.user.basket || [];
    const existsInBasket: boolean = currentBasket.some((item: product_item) => 
      item.id === basketItem.id && 
      item.color === basketItem.color && 
      item.size === basketItem.size
    );
    if (!existsInBasket) {
      const updatedBasket: product_item[] = [...currentBasket, basketItem];
      if (global.user.id !== "Guest") {
        await updateUserField("basket", updatedBasket);
      } else {
        global.user.basket = updatedBasket;
      }
    }
    const updatedFavourite: product_item[] = global.user.favourite.filter((item: product_item) => !(item.id === props.data.id && item.color === props.data.color));
    if (global.user.id !== "Guest") {
      await updateUserField("favourite", updatedFavourite);
    } else {
      global.user.favourite = updatedFavourite;
    }
    emit('item-removed', props.data);
  } catch (err) {
    console.error("❌ Ошибка при перемещении в корзину:", err);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="item" v-if="data && sneaker && selectedFolder">
    <div class="img-wrapper">
      <button class="bin" @click="removeFromFavourite" :disabled="loading">
        <img src="/public/svg/bin.svg" alt="Delete" />
      </button>
      <div class="tag">{{ selectedFolder.name }}</div>
      <img :src="`/sneakers/${sneaker.id}-${selectedFolder.folder_name}/0.jpg`" :alt="sneaker.name" />
    </div>
    <div class="details">
      <div class="name">{{ sneaker.name }}</div>
      <div class="sizes">
        <div v-for="size in sizes" :key="size" :class="{ size: true, active: size === selectedSize }" @click="selectSize(size)":disabled="loading">
          {{ size }}
        </div>
      </div>
      <div class="duo">
        <div class="movetobasket" @click="moveToBasket" :disabled="loading">
          {{ loading ? 'Pending...' : 'Move to basket' }}
        </div>
      </div>
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

    .tag {
      padding: 0.2rem 0.5rem;
      border-radius: 0.35rem;
      text-align: center;
      font-size: 0.8rem;
      color: var(--text-a);
      background: var(--bg-d);
      position: absolute;
      top: 0.25rem;
      left: 0.25rem;
      z-index: 2;
    }

    img {
      position: absolute;
      bottom: 0;
      left: 0;
    }
  }

  .sizes {
    margin: 0.5rem 0 0;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 0.5rem;

    .size {
      padding: 0.2rem 0;
      border-radius: 0.35rem;
      text-align: center;
      font-size: 0.8rem;
      color: var(--text-a);
      background: var(--bg-d);
      cursor: pointer;
    }

    .active {
      color: var(--bg-a);
      background: var(--text-a);
    }
  }

  .duo {
    margin: 0.5rem 0 0;
    display: flex;
    gap: 0.5rem;

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
}

/* Планшеты */
@media (max-width: 1024px) {
  .item {
    padding: 0.8rem;

    .img-wrapper {
      .bin {
        width: 1.8rem;
        height: 1.8rem;
        
        img {
          width: 1.3rem;
        }
      }

      .tag {
        font-size: 0.75rem;
        padding: 0.15rem 0.4rem;
      }
    }

    .sizes {
      gap: 0.4rem;

      .size {
        font-size: 0.75rem;
        padding: 0.15rem 0;
      }
    }

    .duo .movetobasket {
      padding: 0.3rem 0;
      font-size: 0.9rem;
    }
  }
}

/* Телефоны */
@media (max-width: 768px) {
  .item {
    padding: 0.6rem;
    border-radius: 0.8rem;

    .img-wrapper {
      .bin {
        width: 1.6rem;
        height: 1.6rem;
        top: 0.2rem;
        right: 0.2rem;
        
        img {
          width: 1.1rem;
        }
      }

      .tag {
        font-size: 0.7rem;
        padding: 0.1rem 0.3rem;
        top: 0.2rem;
        left: 0.2rem;
      }
    }

    .sizes {
      gap: 0.3rem;

      .size {
        font-size: 0.7rem;
        padding: 0.1rem 0;
      }
    }

    .duo .movetobasket {
      padding: 0.25rem 0;
      font-size: 0.8rem;
    }
  }
}

/* Маленькие телефоны */
@media (max-width: 480px) {
  .item {
    padding: 0.5rem;

    .img-wrapper {
      .bin {
        width: 1.4rem;
        height: 1.4rem;
        
        img {
          width: 1rem;
        }
      }

      .tag {
        font-size: 0.65rem;
        padding: 0.08rem 0.25rem;
      }
    }

    .sizes {
      grid-template-columns: repeat(3, 1fr);
      gap: 0.25rem;

      .size {
        font-size: 0.65rem;
      }
    }

    .duo .movetobasket {
      padding: 0.2rem 0;
      font-size: 0.75rem;
    }
  }
}
</style>
