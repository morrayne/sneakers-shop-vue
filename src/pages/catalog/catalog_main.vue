<script setup lang="ts">
// vue
import { ref, reactive, onMounted, provide, watch } from "vue";
import { useRoute } from 'vue-router';
const route = useRoute();

// components
import wrapper_main from "../../common/wrapper/wrapper_main.vue";
import header_main from "../../common/header/header_main.vue";
import sidebar_main from "./sidebar/sidebar_main.vue";
import list_main from "./list/list_main.vue";
import sidebar_filler from "./fillers/sidebar_filler.vue";

// supabase & types
import { supabase } from "../../helper/imp/supabase";
import type { everything_type } from "../../helper/types";

// vars
const loading = ref(true);
const color_array = reactive<string[]>([]);
const brand_array = reactive<string[]>([]);
const gender_array = reactive<string[]>([]);
const everything = reactive<everything_type>({ search: "", sortBy: "id", sortOrder: "asc", filters: { color: "all", gender: "all", brand: "all" }});

// onMounted & provide
onMounted(() => initializeData());
provide("filterState", { state: everything, arrays: { colors: color_array, brands: brand_array, genders: gender_array }, methods: { setSearch, setSortBy, setSortOrder, setFilter }});

// конкретные функции
const fetchColors = () => fetchUnique<string>("colors");
const fetchBrands = () => fetchUnique<string>("brand");
const fetchGenders = () => fetchUnique<string>("gender");

// универсальная функция получения уникальных значений
async function fetchUnique<T>(column: string): Promise<T[]> {
  try {
    const { data, error } = await supabase.from("sneakers").select(column);
    if (error) throw error;
    if (!data) return [];
    const values = new Set<T>();
    data.forEach((item: any) => {
      const val = item[column];
      if (Array.isArray(val)) {
        val.forEach((v: any) => { if (v.folder_name) values.add(v.folder_name) });
      } else if (val) {
        values.add(val);
      }
    });
    return Array.from(values);
  } catch (err) {
    console.error(`Error fetching ${column}:`, err);
    return [];
  }
}

// загрузка фильтров
async function initializeData() {
  loading.value = true;
  try {
    const [colors, brands, genders] = await Promise.all([fetchColors(), fetchBrands(), fetchGenders()]);
    color_array.push("all", ...colors);
    brand_array.push("all", ...brands);
    gender_array.push("all", ...genders);
  } catch (err) {
    console.error("Ошибка при инициализации фильтров:", err);
  } finally {
    loading.value = false;
  }
}

// функции для управления состоянием
function setSearch(query: string) {
  everything.search = query;
}
function setSortBy(sortBy: string) {
  if (everything.sortBy === sortBy)
    everything.sortOrder = everything.sortOrder === "asc" ? "desc" : "asc";
  else {
    everything.sortBy = sortBy;
    everything.sortOrder = "asc";
  }
}
function setSortOrder(order: "asc" | "desc") { everything.sortOrder = order }
function setFilter(type: "color" | "gender" | "brand", value: string) { everything.filters[type] = value }

// При заходе на страницу читаем query и применяем переданные фильтры
onMounted(() => {
  const q = route.query;
  if (q.brand) setFilter('brand', String(q.brand));
  if (q.gender) setFilter('gender', String(q.gender));
  if (q.color) setFilter('color', String(q.color));
});

// Если query меняется — синхронизируем фильтры
watch(() => route.query, (newQ) => {
  if (newQ.brand) setFilter('brand', String(newQ.brand));
  if (newQ.gender) setFilter('gender', String(newQ.gender));
  if (newQ.color) setFilter('color', String(newQ.color));
});
</script>

<template>
  <wrapper_main>
    <header_main />
    <main>
      <div class="left">
        <sidebar_main v-if="!loading && color_array.length !== 0 && brand_array.length !== 0 && gender_array.length !== 0" :color_array="color_array" :brand_array="brand_array" :gender_array="gender_array" />
        <sidebar_filler v-else />
      </div>
      <div class="right">
        <list_main />
      </div>
    </main>
  </wrapper_main>
</template>

<style scoped lang="scss">
main {
  height: 100%;
  display: flex;
  overflow: hidden;

  .left {
    width: 18rem;
    min-height: 16rem;
    padding: 1rem;
    border-right: solid 0.125rem var(--bg-c);
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow-y: scroll;
  }
  ::-webkit-scrollbar {
    display: none;
  }
  .right {
    width: calc(100% - 18rem);
    padding: 1rem;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 1rem;
    overflow-y: scroll;
    position: relative;
  }
  ::-webkit-scrollbar {
    display: none;
  }
}

/* Планшеты горизонтальные */
@media (max-width: 1720px) {
  main {
    .right {
      grid-template-columns: repeat(4, 1fr);
    }
  }
}

/* Планшеты */
@media (max-width: 1480px) {
  main {
    .right {
      grid-template-columns: repeat(3, 1fr);
    }
  }
}

/* Маленькие планшеты */
@media (max-width: 1180px) {
  main {
    .left {
      max-width: 16rem;
      height: 100%;
    }
    
    .right {
      width: 100%;
      grid-template-columns: repeat(2, 1fr);
    }
  }
}

/* Большие телефоны */
@media (max-width: 1024px) {
  main {
    .right {
      gap: 0.8rem;
      padding: 0.8rem;
    }
    
    .left {
      padding: 0.8rem;
      gap: 0.8rem;
    }
  }
}

/* Телефоны */
@media (max-width: 768px) {
  main {
    flex-direction: column;

    .right {
      width: 100%;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.6rem;
      padding: 0.6rem;
    }
    
    .left {
      max-width: unset;
      width: 100%;
      padding: 0.6rem;
      gap: 0.6rem;
      max-height: 18rem;
    }
  }
}

/* Маленькие телефоны */
@media (max-width: 480px) {
  main {
    .right {
      grid-template-columns: 1fr;
      gap: 0.5rem;
      padding: 0.5rem;
    }
    
    .left {
      padding: 0.5rem;
      gap: 0.5rem;
      max-height: 16rem;
    }
  }
}

/* Очень маленькие телефоны */
@media (max-width: 360px) {
  main {
    .right {
      padding: 0.4rem;
      gap: 0.4rem;
    }
    
    .left {
      padding: 0.4rem;
      gap: 0.4rem;
    }
  }
}
</style>
