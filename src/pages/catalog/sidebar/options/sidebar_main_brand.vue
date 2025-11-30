<script setup lang="ts">
// vue 
import { inject, computed } from "vue";

// components & types
import sidebar_item from "../sidebar_item.vue";
import type { provide_everything } from '../../../../helper/types';

// filterState получается через inject
const filterState = inject("filterState") as provide_everything;
if (!filterState) { throw new Error("filterState is undefined! Проверьте provide в родителе.") }

// props & vars
const props = defineProps<{ data_array: string[] }>();
const activeBrand = computed(() => filterState.state.filters.brand);
</script>

<template>
  <div class="filter-holder">
    <div class="size i18n" data-key="brand"></div>
    <sidebar_item v-for="item in props.data_array" :key="item" :name="item" :val="item" :display_color="false" :color="'#000'" :active="activeBrand === item" :direction="false" @was-clicked="() => filterState.methods.setFilter('brand', item)" />
  </div>
</template>

<style scoped lang="scss">
.size.i18n[data-key="brand"]::after {
  content: var(--brand);
}
.filter-holder {
  display: flex;
  flex-direction: column;

  .size {
    font-size: 1.2rem;
    margin: 0.25rem 0;
  }
}

/* Планшеты */
@media (max-width: 1024px) {
  .filter-holder .size {
    font-size: 1.1rem;
  }
}

/* Телефоны */
@media (max-width: 768px) {
  .filter-holder .size {
    font-size: 1rem;
  }
}

/* Маленькие телефоны */
@media (max-width: 480px) {
  .filter-holder .size {
    font-size: 0.9rem;
  }
}
</style>
