<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import { supabase } from "../../helper/supabase";

import catalog_card from "./catalog_card.vue";
import catalog_filler from "./catalog_filler.vue";
import header_main from "../../components/header/header_main.vue";
import catalog_sidebar from "./catalog_sidebar.vue";

const sneakers = ref<any[]>([]);
const loading = ref(false);
const error = ref(false);

const filter_sort_search = reactive({
  sortBy: "id",
  gender: "uni",
  brand: "all",
  colors: "all",
  search: "",
});

async function fetchProducts() {
  try {
    loading.value = true;
    error.value = false;
    const { data, error: supabaseError } = await supabase.from("sneakers").select("*");
    if (supabaseError) throw supabaseError;
    sneakers.value = data || [];
  } catch (err: any) {
    error.value = true;
  } finally {
    loading.value = false;
  }
}

const filteredSneakers = computed(() => {
  let result = sneakers.value;
  if (filter_sort_search.brand !== "all") {
    result = result.filter((item) => item.brand === filter_sort_search.brand);
  }
  if (filter_sort_search.gender !== "uni") {
    result = result.filter((item) => item.gender === filter_sort_search.gender);
  }
  if (filter_sort_search.colors !== "all") {
    result = result.filter((item) =>
      Array.isArray(item.colors) &&
      item.colors.some((c: any) => c.folder_name === filter_sort_search.colors)
    );
  }
  if (filter_sort_search.search.trim() !== "") {
    const q = filter_sort_search.search.toLowerCase();
    result = result.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.brand.toLowerCase().includes(q)
    );
  }
  result = [...result].sort((a, b) =>
    a[filter_sort_search.sortBy] > b[filter_sort_search.sortBy] ? 1 : -1
  );
  return result;
});
onMounted(() => fetchProducts());
</script>

<template>
  <div class="catalog">
    <div class="wrapper">
      <div class="content">
        <header_main />
        <main>
          <div class="left">
            <catalog_sidebar :sneakers="sneakers" @filter-change="(v) => Object.assign(filter_sort_search, v)" @search-change="(v) => (filter_sort_search.search = v)" />
          </div>
          <div class="right">
            <catalog_filler v-if="loading" v-for="value in 15" :key="value" />
            <catalog_card v-else v-for="sneaker in filteredSneakers" :key="sneaker.id" :data="sneaker" />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.catalog {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--main-bg);

  .wrapper {
    max-width: 2160px;
    max-height: 1080px;
    width: 100%;
    height: 100%;
    padding: 1rem;
    background: var(--main-bg);

    .content {
      width: 100%;
      height: 100%;
      position: relative;
      background: var(--sub-bg);
      border: solid 1px var(--extra-bg);
      border-radius: 1rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      main {
        height: calc(100% - 4rem);
        display: flex;

        .left {
          width: 18rem;
          height: 100%;
          border-right: solid 0.125rem var(--extra-bg);
          display: flex;
          flex-direction: column;
          gap: 1rem;
          overflow-y: scroll;
        }

        .right {
          width: calc(100% - 18rem);
          height: 100%;
          padding: 1rem;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1rem;
          overflow-y: scroll;

          .empty {
            grid-column: 1 / -1;
            text-align: center;
            color: var(--sub-text);
            font-size: 1.2rem;
            padding: 2rem 0;
          }
        }
        
        ::-webkit-scrollbar {
          display: none;
        }
      }
    }
  }
}
</style>
