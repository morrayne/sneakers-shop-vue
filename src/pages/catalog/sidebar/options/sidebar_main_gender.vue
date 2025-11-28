<script setup lang="ts">
// vue
import { inject, computed } from "vue";

// components
import sidebar_item from "../sidebar_item.vue";

// filterState получается через inject
const filterState = inject("filterState") as any;
if (!filterState) { throw new Error("filterState is undefined! Проверьте provide в родителе.") }

// props
const props = defineProps<{ data_array: string[] }>();

// активный пол
const activeGender = computed(() => filterState.state.filters.gender);
</script>

<template>
  <div class="filter-holder">
    <div class="size i18n" data-key="gender"></div>
    <sidebar_item 
      v-for="item in props.data_array" 
      :key="item" 
      :name="item" 
      :val="item" 
      :display_color="false" 
      :color="'#000'"
      :direction="false"
      :active="activeGender === item"
      @was-clicked="() => filterState.methods.setFilter('gender', item)"
    />
  </div>
</template>

<style scoped lang="scss">
.size.i18n[data-key="gender"]::after {
  content: var(--gender);
}
.filter-holder {
  display: flex;
  flex-direction: column;

  .size {
    font-size: 1.2rem;
  }
}
</style>
