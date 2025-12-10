<script setup lang="ts">
// vue
import { ref, computed, onMounted } from "vue";

// router & pinia
import { useGlobalState } from "../../../helper/pinia";
const global = useGlobalState();
import {
  addToBasket,
  addToFavourites,
  removeFromFavourites,
} from "../../../helper/actions";
import router from "../../../helper/router";
function navigateToProduct() {
  router.push(`/product/${props.data.id}`);
}

// props
const props = defineProps<{ data: any }>();

// монтирование
onMounted(() => {
  active_color.value = props.data.displayColor ?? 0;
});
onMounted(() => {
  return () => {
    if (timeoutId.value) {
      clearTimeout(timeoutId.value);
    }
  };
});

// Функция для получения переведенной валюты
function getTranslatedRub() {
  const value = getComputedStyle(document.documentElement).getPropertyValue(
    "--rub"
  );
  return value ? value.replace(/^"(.*)"$/, "$1") : "rub";
}

// vars
const active_color = ref(0);
const displaySizes = ref(false);
const activeSize = ref("42.0");
const activeQuantity = ref(1);
const timeoutId = ref<number | null | any>(null);
const activeAction = ref<"basket" | "favourite" | null>(null);
const activeColorData = computed(() => props.data.colors?.[active_color.value]);
const sizes = [
  "40.0",
  "40.5",
  "41.0",
  "41.5",
  "42.0",
  "42.5",
  "43.0",
  "43.5",
  "44.0",
];
const isFavourite = computed(
  () =>
    global.user?.favourite.some(
      (f) => f.id === props.data.id && f.color === activeColorData.value.name
    ) ?? false
);
const inBasket = computed(
  () =>
    global.user?.basket.some(
      (f) =>
        f.id === props.data.id &&
        f.color === activeColorData.value.name &&
        f.size === activeSize.value
    ) ?? false
);

// добавление в корзину
async function handleAddToBasket(event: Event) {
  event.stopPropagation();
  if (!displaySizes.value) {
    openSizes("basket");
    return;
  }
  try {
    const basketItem = {
      id: props.data.id,
      color: activeColorData.value.name,
      size: activeSize.value,
      quantity: activeQuantity.value,
    };
    await addToBasket(basketItem);
    displaySizes.value = false;
    clearTimeout(timeoutId.value);
  } catch (err: any) {
    console.error(err);
  }
}

// добавление в избранное
async function toggleFavourite(event: Event) {
  event.stopPropagation();
  const favouriteItem = {
    id: props.data.id,
    color: activeColorData.value.name,
    quantity: activeQuantity.value,
  };
  if (isFavourite.value) {
    await removeFromFavourites(favouriteItem);
  } else {
    await addToFavourites(favouriteItem);
  }
}

// смена выбранного цвета
function setActiveColor(val: number, event: Event) {
  event.stopPropagation();
  active_color.value = val;
}

function openSizes(action: "basket" | "favourite") {
  displaySizes.value = true;
  activeAction.value = action;
  if (timeoutId.value) {
    clearTimeout(timeoutId.value);
  }
  timeoutId.value = setTimeout(() => {
    displaySizes.value = false;
    activeAction.value = null;
  }, 5000);
}

function selectSize(size: string, event: Event) {
  event.stopPropagation();
  activeSize.value = size;
  if (activeAction.value === "basket") {
    handleAddToBasket(event);
  } else if (activeAction.value === "favourite") {
    // Для избранного вызываем toggleFavourite, который теперь обрабатывает добавление
    toggleFavourite(event);
  }
}

function incQuantity(event: Event) {
  event.stopPropagation();
  activeQuantity.value = Math.min(99, activeQuantity.value + 1);
}

function decQuantity(event: Event) {
  event.stopPropagation();
  activeQuantity.value = Math.max(1, activeQuantity.value - 1);
}
</script>

<template>
  <div class="card" @click="navigateToProduct">
    <div class="img-holder">
      <div class="size-options" v-if="displaySizes">
        <button
          v-for="value in sizes"
          :key="value"
          :class="{ active: activeSize === value }"
          @click="selectSize(value, $event)"
        >
          {{ value }}
        </button>
      </div>
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
        :class="inBasket ? 'btn active' : 'btn'"
        v-if="global.user"
        @click="handleAddToBasket"
      >
        {{
          displaySizes && activeAction === "basket"
            ? "Select size"
            : `${props.data.cost} ${getTranslatedRub()}`
        }}
      </button>
      <div class="qty-controls" v-if="global.user">
        <button class="qty-btn" @click="decQuantity($event)">-</button>
        <div class="qty-val">{{ activeQuantity }}</div>
        <button class="qty-btn" @click="incQuantity($event)">+</button>
      </div>
      <button
        :class="isFavourite ? 'fav active' : 'fav'"
        v-if="global.user"
        @click="toggleFavourite"
      >
        <img src="/public/svg/heart.svg" />
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

    .size-options {
      width: 100%;
      padding: 0.25rem;
      position: absolute;
      top: 2rem;
      z-index: 3;
      display: grid;
      gap: 0.25rem;
      grid-template-columns: repeat(3, 1fr);

      button {
        height: fit-content;
        font-size: 0.8rem;
        color: var(--text-a);
        background: var(--bg-d);
        padding: 0.2rem 0.5rem;
        border-radius: 0.5rem;
        white-space: nowrap;
      }

      .active {
        background: var(--text-a);
        color: var(--bg-a);
      }
    }

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
    }

    .active {
      color: var(--text-a) !important;
      background: var(--accent-a) !important;
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

    .qty-controls {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      background: var(--bg-d);
      padding: 0.25rem;
      border-radius: 0.5rem;
    }

    .qty-btn {
      width: 1.6rem;
      height: 1.6rem;
      border: none;
      background: transparent;
      color: var(--text-a);
      font-weight: 700;
      cursor: pointer;
    }

    .qty-val {
      min-width: 1.2rem;
      text-align: center;
      color: var(--text-a);
      font-weight: 700;
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
    padding: 0.6rem;
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

      .btn {
        font-size: 0.8rem;
      }

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
