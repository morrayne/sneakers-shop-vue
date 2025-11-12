<script setup lang="ts">
import { ref, onMounted, watch } from "vue";

// components
import loading_main from "../../common/loading/loading_main.vue";
import wrapper_main from "../../common/wrapper/wrapper_main.vue";
import header_main from "../../common/header/header_main.vue";
import basket_item from "./basket_item.vue";

// pinia & supabase
import { supabase } from "../../helper/supabase";
import { useGlobalState } from "../../helper/pinia";
const global = useGlobalState();

// helper & types
import { updateUserField } from "../../helper/actions";
import type { sneaker_color } from "../../helper/types";

// state
const basket_array = ref<any[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

// загрузка корзины
async function fetchBasket() {
  if (global.user.id === "filler") {
    basket_array.value = [];
    loading.value = false;
    return;
  }
  loading.value = true;
  error.value = null;
  try {
    const { data: sneakers, error: supabaseError } = await supabase
      .from("sneakers")
      .select("*");
    if (supabaseError) throw supabaseError;
    const sneakersMap = new Map<number, any>();
    sneakers?.forEach((item) => sneakersMap.set(item.id, item));
    basket_array.value = global.user.basket
      .map((basketItem) => {
        const sneaker = sneakersMap.get(basketItem.id);
        if (!sneaker) return null;
        const colorIndex =
          typeof basketItem.color === "number"
            ? basketItem.color
            : (sneaker.colors as sneaker_color[]).findIndex(
                (c) => c.name === basketItem.color
              );
        return {
          ...sneaker,
          favouriteColor: colorIndex,
          favouriteSize: basketItem.size,
        };
      })
      .filter(Boolean);
  } catch (err: any) {
    console.error("Ошибка загрузки корзины:", err);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

// обработчик удаления элемента
async function handleItemRemoved(itemId: number, colorIndex: number, size: string) {
  const updatedBasket = global.user.basket.filter((item) => {
    const sameId = item.id === itemId;
    const sameSize = item.size === size;
    const sameColor = String(item.color) === String(colorIndex);
    return !(sameId && sameColor && sameSize);
  });

  await updateUserField("basket", updatedBasket);
  global.user.basket = updatedBasket;

  // просто убираем товар локально — без перезагрузки корзины
  basket_array.value = basket_array.value.filter(
    (item) =>
      item.id !== itemId ||
      item.favouriteColor !== colorIndex ||
      item.favouriteSize !== size
  );

  console.log("🗑️ Удалено из корзины:", itemId, colorIndex, size);
}

// монтирование
onMounted(fetchBasket);

// следим за изменением пользователя или корзины
watch(() => global.user.id, fetchBasket);
</script>

<!-- prettier-ignoref -->
<template>
  <wrapper_main>
    <header_main />
    <main>
      <div :class="basket_array.length === 0 ? 'center' : 'normal'">
        <div v-if="loading" class="loa">
          <loading_main />
        </div>
        <basket_item
          v-else
          v-for="item in basket_array"
          :key="`${item.id}-${item.favouriteColor}`"
          :data="item"
          @item-removed="handleItemRemoved"
        />
        <div v-if="!loading && basket_array.length === 0" class="loa">
          <img src="/public/gif/evernight.gif" alt="No items" />
          <p v-if="global.user.id !== 'filler'">No sneakers in basket</p>
          <p v-else>You are not authorized</p>
        </div>
      </div>
      <div class="right" v-if="basket_array.length !== 0">
        <div class="vfv" v-for="value in basket_array">
          <div class="name">
            {{ value.name }}
          </div>
          <div class="cost">{{ value.cost }} rub</div>
        </div>
        <div class="finalcost">
          {{ basket_array.reduce((sum, item) => sum + (item.cost || 0), 0) }}
          rub
        </div>
      </div>
    </main>
  </wrapper_main>
</template>

<style scoped lang="scss">
main {
  height: 100%;
  display: flex;
  overflow: hidden;

  .normal,
  .center {
    overflow: scroll;
    height: 100%;
  }

  .normal {
    width: calc(100% - 28rem);
    padding: 1rem;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
  }
  .center {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  ::-webkit-scrollbar {
    display: none;
  }

  .right {
    min-width: unset;
    width: 28rem;
    height: 100%;
    border-left: solid 2px var(--bg-c);
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    overflow: scroll;

    .vfv {
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      display: flex;
      justify-content: space-between;
      background: var(--bg-c);
    }

    .finalcost {
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      background: var(--text-b);
      color: var(--bg-a);
      text-align: center;
      cursor: pointer;
    }
  }  ::-webkit-scrollbar {
    display: none;
  }

  .loa {
    p {
      width: 20rem;
      text-align: center;
    }
  }
}
</style>
