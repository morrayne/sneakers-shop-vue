<script setup lang="ts">
// inject
import { inject, computed } from "vue";
import sidebar_item from "../sidebar_item.vue";

// filterState через inject
const filterState = inject("filterState") as any;
if (!filterState) { throw new Error("filterState is undefined! Проверьте provide в родителе.") }

// props
const props = defineProps<{ data_array: string[] }>();

// вычисляем активный бренд
const activeBrand = computed(() => filterState.state.filters.brand);
</script>

<template>
  <div class="filter-holder">
    <div class="size">Brand</div>
    <sidebar_item
      v-for="item in props.data_array"
      :key="item"
      :name="item"
      :val="item"
      :display_color="false"
      :color="'#000'"
      :active="activeBrand === item"
      @was-clicked="() => filterState.methods.setFilter('brand', item)"
    />
  </div>
</template>


<!--  -->

<style scoped lang="scss">
.filter-holder {
  display: flex;
  flex-direction: column;

  .size {
    font-size: 1.2rem;
  }
}
</style>
