<script setup lang="ts">
// vue
import { ref, reactive, onMounted, provide } from "vue";

// components
import wrapper_main from "../../common/wrapper/wrapper_main.vue";
import header_main from "../../common/header/header_main.vue";
import sidebar_main from "./sidebar/sidebar_main.vue";
import list_main from "./list/list_main.vue";
import sidebar_filler from "./fillers/sidebar_filler.vue";

// supabase
import { supabase } from "../../helper/supabase";

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
        val.forEach((v: any) => { if (v.folder_name) values.add(v.folder_name); });
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

// конкретные функции
const fetchColors = () => fetchUnique<string>("colors");
const fetchBrands = () => fetchUnique<string>("brand");
const fetchGenders = () => fetchUnique<string>("gender");

// state
const loading = ref(true);
const color_array = reactive<string[]>([]);
const brand_array = reactive<string[]>([]);
const gender_array = reactive<string[]>([]);

// search & sort & filter
const everything = reactive({
  search: "",
  sortBy: "id",
  sortOrder: "asc",
  filters: { color: "all", gender: "all", brand: "all" },
});

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
function setSearch(query: string) { everything.search = query; }
function setSortBy(sortBy: string) {
  if (everything.sortBy === sortBy) everything.sortOrder = everything.sortOrder === "asc" ? "desc" : "asc";
  else { everything.sortBy = sortBy; everything.sortOrder = "asc"; }
}
function setSortOrder(order: "asc" | "desc") { everything.sortOrder = order; }
function setFilter(type: "color" | "gender" | "brand", value: string) { everything.filters[type] = value; }

// монтирование
onMounted(() => initializeData());

// provide для sidebar и list
provide("filterState", {state: everything, arrays: { colors: color_array, brands: brand_array, genders: gender_array }, methods: { setSearch, setSortBy, setSortOrder, setFilter }});
</script>

<template>
  <wrapper_main>
    <header_main />
    <main>
      <div class="left">
        <sidebar_filler v-if="loading" />
        <sidebar_main v-else :color_array="color_array" :brand_array="brand_array" :gender_array="gender_array" />
      </div>
      <div class="right">
        <list_main />
      </div>
    </main>
  </wrapper_main>
</template>

<style scoped lang="scss">
main {
  height: calc(100% - 4rem);
  display: flex;

  .left {
    width: 18rem;
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
  }
  ::-webkit-scrollbar {
    display: none;
  }
}
</style>
