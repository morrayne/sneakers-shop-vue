<script setup lang="ts">
// props
const props = defineProps<{ data_array: string[] }>();

// imports
import sidebar_item from "../sidebar_item.vue";
</script>

<template>
  <div class="filter-holder">
    <div class="size">Gender</div>
    <sidebar_item 
      v-for="item in props.data_array" 
      :key="item" 
      :name="item" 
      :val="item" 
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
