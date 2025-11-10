<script setup lang="ts">
// vue
import { ref, onMounted, watch } from "vue";

// vars
const fav_array = ref<any[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

// supabase
import { supabase } from "../../helper/supabase";

// pinia
import { useGlobalState } from "../../helper/pinia";
const global = useGlobalState();

// Получение кроссовок
async function fetchFavs() {
  try {
    loading.value = true;
    error.value = null;

    const { data, error: supabaseError } = await supabase
      .from("sneakers")
      .select("*");
    if (supabaseError) throw supabaseError;

    fav_array.value = [];

    // Создаем Map для быстрого поиска по ID
    const sneakersMap = new Map();
    data.forEach((item: any) => {
      sneakersMap.set(item.id, item);
    });

    // Проходим по избранному и находим соответствующие кроссовки
    global.user.favourite.forEach((favItem: any) => {
      const sneaker = sneakersMap.get(favItem.id);
      if (sneaker) {
        fav_array.value.push({
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

// компоненты
import header_main from "../../common/header/header_main.vue";
import wrapper_main from "../../common/wrapper/wrapper_main.vue";
import favourite_item from "./favourite_item.vue";

// 
function handleItemRemoved(itemId: number) {
  fav_array.value = fav_array.value.filter(item => item.id !== itemId);
  fetchFavs();
}

// монтирование компонента
onMounted(() => {
  if (global.user.id !== "filler") {
    fetchFavs();
  }
});

// Следим за изменением пользователя
watch(
  () => global.user.id,
  (newId) => {
    if (newId !== "filler") {
      fetchFavs();
    } else {
      fav_array.value = [];
      loading.value = false;
    }
  }
);

// Следим за изменением избранного
watch(() => global.user.favourite, () => {
  if (global.user.id !== "filler") {
    fetchFavs();
  }
}, { deep: true });
</script>

<template>
  <wrapper_main>
    <header_main />
    <main>
      <div v-if="loading" class="loading">Загрузка избранного...</div>
      <favourite_item 
    v-for="item in fav_array" 
    :key="`${item.id}-${item.favouriteColor}`" 
    :data="item"
    @item-removed="handleItemRemoved"
  />
    </main>
  </wrapper_main>
</template>

<style scoped lang="scss">
main {
  height: fit-content;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1rem;
  padding: 1rem;
}
</style>
