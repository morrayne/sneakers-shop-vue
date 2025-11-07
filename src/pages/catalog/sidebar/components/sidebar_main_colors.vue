<script setup lang="ts">
// props
const props = defineProps<{ data_array: string[] }>();

// imports
import sidebar_item from "../sidebar_item.vue";
</script>

<template>
  <div class="filter-holder">
    <div class="size">Colors</div>
    <sidebar_item 
      v-for="item in props.data_array" 
      :key="item" 
      :name="item" 
      :val="item" 
      :display_color="true" 
      :color="item"
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