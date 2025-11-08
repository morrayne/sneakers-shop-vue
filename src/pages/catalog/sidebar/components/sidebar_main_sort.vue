<script setup lang="ts">
import { inject, computed } from "vue";
import sidebar_item from "../sidebar_item.vue";

// filterState через inject
const filterState = inject("filterState") as any;

if (!filterState) {
  throw new Error("filterState is undefined! Проверьте provide в родителе.");
}

// массив опций сортировки
const data_array = [
  { name: "appearence date", val: "id" },
  { name: "name", val: "name" },
  { name: "brand", val: "brand" },
  { name: "rating", val: "rating" },
  { name: "gender", val: "gender" },
  { name: "cost", val: "cost" },
];

// вычисляем активную опцию
const activeSort = computed(() => filterState.state.sortBy);
</script>

<template>
  <div class="filter-holder">
    <div class="size">Sort by</div>
    <sidebar_item
      v-for="option in data_array"
      :key="option.val"
      :name="option.name"
      :val="option.val"
      :display_color="false"
      :color="'#000'"
      :active="activeSort === option.val"
      @was-clicked="() => filterState.methods.setSortBy(option.val)"
    />
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
