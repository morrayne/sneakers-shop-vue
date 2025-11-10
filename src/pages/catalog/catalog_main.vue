<script setup lang="ts">
// vue
import { ref, reactive, onMounted, provide } from "vue";

// imports
import sidebar_filler from "./fillers/sidebar_filler.vue";

// fetch functions
import { fetchColors, fetchBrands, fetchGenders } from "./catalog_fetch";

// components
import header_main from "../../common/header/header_main.vue";
import wrapper_main from "../../common/wrapper/wrapper_main.vue";
import sidebar_main from "./sidebar/sidebar_main.vue";
import list_main from "./list/list_main.vue";

// vars
const loading = ref(true);
const color_array = reactive<string[]>([]);
const brand_array = reactive<string[]>([]);
const gender_array = reactive<string[]>([]);

// search sort and filter
const everything = reactive<any>({
  search: "",
  sortBy: "id",
  filters: {
    color: "all",
    gender: "all",
    brand: "all",
  },
});

// инициализация данных
async function initializeData() {
  loading.value = true;
  try {
    const [colors, brands, genders] = await Promise.all([
      fetchColors(),
      fetchBrands(),
      fetchGenders(),
    ]);
    color_array.push("all", ...colors);
    brand_array.push("all", ...brands);
    gender_array.push("all", ...genders);
  } catch (err) {
    console.error("Ошибка при инициализации фильтров:", err);
  } finally {
    loading.value = false;
  }
}

// функции для обновления состояния
function setSearch(query: string) {
  everything.search = query;
}

function setSortBy(sortBy: string) {
  everything.sortBy = sortBy;
}

function setFilter(type: "color" | "gender" | "brand", value: string) {
  everything.filters[type] = value;
}

// монтирование компонента
onMounted(() => {
  initializeData();
});

// предоставление данных сортировки / фильтра / поиска
provide("filterState", {
  state: everything,
  arrays: {
    colors: color_array,
    brands: brand_array,
    genders: gender_array,
  },
  methods: {
    setSearch,
    setSortBy,
    setFilter,
  },
});
</script>

<template>
  <wrapper_main>
    <header_main />
    <main>
      <div class="left">
        <sidebar_filler v-if="loading" />
        <sidebar_main v-else :color_array="color_array" :brand_array="brand_array" :gender_array="gender_array" />
      </div>
      <div class="right" >
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
