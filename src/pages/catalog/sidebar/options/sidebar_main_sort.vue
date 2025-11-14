<script setup lang="ts">
// vue
import { inject, computed } from "vue";

// components
import sidebar_item from "../sidebar_item.vue";

// filterState получается через inject
const filterState = inject("filterState") as any;

// массив вариантов сортировки
const data_array = [
  { name: "appearence date", val: "id" },
  { name: "name", val: "name" },
  { name: "brand", val: "brand" },
  { name: "rating", val: "rating" },
  { name: "gender", val: "gender" },
  { name: "cost", val: "cost" },
];

// vars
const activeSort = computed(() => filterState.state.sortBy);
const sortOrder = computed(() => filterState.state.sortOrder);

// Функция для получения направления (только для активной сортировки)
function getSortDirection(optionVal: string) {
  if (activeSort.value !== optionVal) return false;
  return sortOrder.value === "asc" ? "down" : "up";
}
function handleSortClick(optionVal: string) {
  filterState.methods.setSortBy(optionVal);
}
</script>

<template>
  <div class="filter-holder">
    <div class="size">Sort by</div>
    <sidebar_item v-for="option in data_array" :key="option.val" :name="option.name" :val="option.val" :display_color="false" :color="'#000'" :direction="getSortDirection(option.val)" :active="activeSort === option.val" @was-clicked="handleSortClick" />
  </div>
</template>

<style scoped lang="scss">
.filter-holder {
  display: flex;
  flex-direction: column;

  .size {
    font-size: 1.2rem;
  }
}
</style>
