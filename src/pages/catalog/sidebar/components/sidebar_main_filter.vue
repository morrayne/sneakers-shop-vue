<script setup lang="ts">
// imports
import sidebar_item from "../sidebar_item.vue";

// vars
const data_array = [
  {
    name: "appearence date",
    val: "id",
  },
  {
    name: "name",
    val: "name",
  },
  {
    name: "brand",
    val: "brand",
  },
  {
    name: "rating",
    val: "rating",
  },
  {
    name: "gender",
    val: "gender",
  },
  {
    name: "cost",
    val: "cost",
  },
];
</script>

<template>
  <div class="filter-holder">
    <div class="size">Sort by</div>
    <sidebar_item
      v-for="value in data_array"
      :key="value.val"
      :name="value.name"
      :val="value.val"
      :display_color="false"
      :color="'#000'"
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
