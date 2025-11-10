<script setup lang="ts">
// vue
import { ref, onMounted, watch } from "vue";

// vars
const basket_array = ref<any[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

// supabase
import { supabase } from "../../helper/supabase";

// pinia
import { useGlobalState } from "../../helper/pinia";
const global = useGlobalState();

// components
import header_main from "../../common/header/header_main.vue";
import wrapper_main from "../../common/wrapper/wrapper_main.vue";
import basket_item from "./basket_item.vue";

// Получение избранного
async function fetchFavs() {
  if (global.user.id === "filler") {
    loading.value = false;
    return;
  }

  try {
    loading.value = true;
    error.value = null;

    const { data, error: supabaseError } = await supabase
      .from("sneakers")
      .select("*");
    if (supabaseError) throw supabaseError;
    basket_array.value = [];

    // Создаем Map для быстрого поиска по ID
    const sneakersMap = new Map();
    data.forEach((item: any) => {
      sneakersMap.set(item.id, item);
    });

    // Проходим по избранному и находим соответствующие кроссовки
    global.user.basket.forEach((favItem: any) => {
      const sneaker = sneakersMap.get(favItem.id);
      if (sneaker) {
        basket_array.value.push({
          ...sneaker,
          favouriteColor: favItem.color,
          favouriteSize: favItem.size,
        });
      }
    });
  } catch (err: any) {
    console.error("Error fetching favourites:", err);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

// Обработчик удаления элемента
function handleItemRemoved(itemId: number) {
  basket_array.value = basket_array.value.filter((item) => item.id !== itemId);
}

// монтирование компонента
onMounted(() => {
  fetchFavs();
});

// Следим за изменениями пользователя
watch(
  () => global.user.id,
  (newId) => {
    if (newId !== "filler") {
      fetchFavs();
    } else {
      basket_array.value = [];
      loading.value = false;
    }
  }
);

// Следим за изменением избранного
watch(
  () => global.user.favourite,
  () => {
    if (global.user.id !== "filler") {
      fetchFavs();
    }
  },
  { deep: true }
);
</script>

<template>
  <wrapper_main>
    <header_main />
    <main>
      <div class="left">
        <basket_item
          v-for="item in basket_array"
          :key="`${item.id}-${item.favouriteColor}`"
          :data="item"
          @item-removed="handleItemRemoved"
        />
      </div>
      <div class="right"></div>
    </main>
  </wrapper_main>
</template>

<style scoped lang="scss">
main {
  height: 100%;
  display: flex;
  overflow: hidden;

  .left {
    width: calc(100% - 28rem);
    height: 100%;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    padding: 1rem;
    overflow: scroll;
  }

  ::-webkit-scrollbar {
    display: none;
  }

  .right {
    min-width: unset;
    width: 28rem;
    height: 100%;
    border-left: solid 2px var(--bg-b);
  }
}
</style>
