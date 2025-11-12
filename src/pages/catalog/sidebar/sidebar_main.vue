<script setup lang="ts">
// inject
import { inject } from "vue";

// Получаем filterState один раз
const filterState = inject("filterState") as any;
if (!filterState) {
  throw new Error("filterState is undefined! Проверьте provide в родителе.");
}

// props
const props = defineProps<{
  color_array: any;
  brand_array: any;
  gender_array: any;
}>();

// components
import sidebar_main_filter from "./options/sidebar_main_sort.vue";
import sidebar_main_genders from "./options/sidebar_main_gender.vue";
import sidebar_main_colors from "./options/sidebar_main_color.vue";
import sidebar_main_brands from "./options/sidebar_main_brand.vue";

// заполнение поисковой строки
function handleinput(event: Event) {
  const target = event.target as HTMLInputElement;
  filterState.methods.setSearch(target.value);
}
</script>

<template>
  <input type="text" class="search" placeholder="Nike Air Max 95" @input="handleinput($event)" />
  <sidebar_main_filter />
  <sidebar_main_colors :data_array="props.color_array" />
  <sidebar_main_genders :data_array="props.gender_array" />
  <sidebar_main_brands :data_array="props.brand_array" />
</template>

<style scoped lang="scss">
.search {
  width: 100%;
  background: var(--bg-c);
  outline: solid 1px var(--bg-c);
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  opacity: 1;
}:focus {
    outline: solid 1px var(--text-a);
}
::placeholder {
  color: var(--text-c);
}
</style>
