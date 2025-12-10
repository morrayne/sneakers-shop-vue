<script setup lang="ts">
// vue
import { inject, computed } from "vue";

// components & types
import sidebar_item from "../sidebar_item.vue";
import type { provide_everything } from '../../../../helper/types';

// filterState получается через inject
const filterState = inject("filterState") as provide_everything;

// vars
const activeSort = computed(() => filterState.state.sortBy);
const sortOrder = computed(() => filterState.state.sortOrder);
const data_array = [
  { name: "releaseDate", val: "id" },
  { name: "name", val: "name" },
  { name: "brand", val: "brand" },
  { name: "rating", val: "rating" },
  { name: "gender", val: "gender" },
  { name: "price", val: "cost" },
];

// Функция для получения переведенного названия
function getTranslatedName(key: string) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(`--${key}`);
  return value ? value.replace(/^"(.*)"$/, '$1') : key;
}

// Функция для получения направления (только для активной сортировки)
function getSortDirection(optionVal: string) {
  if (activeSort.value !== optionVal) return false;
  if (document.documentElement.getAttribute('lang') === 'ru') {
    return sortOrder.value === "asc" ? "вниз" : "вверх";
  } else {
    return sortOrder.value === "asc" ? "down" : "up";
  }
}

function handleSortClick(optionVal: string) {
  filterState.methods.setSortBy(optionVal);
}
</script>

<template>
  <div class="filter-holder">
    <div class="size">{{ getTranslatedName('sortBy') }}</div>
    <sidebar_item v-for="option in data_array" :key="option.val" :name="getTranslatedName(option.name)" :val="option.val" :display_color="false" :color="'#000'" :direction="getSortDirection(option.val)" :active="activeSort === option.val" @was-clicked="handleSortClick" />
  </div>
</template>

<style scoped lang="scss">
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
  .filter-holder {
    width: 100%;

    .size {
      font-size: 1rem;
    }
  }
}

/* Маленькие телефоны */
@media (max-width: 480px) {
  .filter-holder .size {
    font-size: 0.9rem;
  }
}
</style>
