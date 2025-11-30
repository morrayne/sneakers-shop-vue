<script setup lang="ts">
// vue
import { inject } from "vue";

// props & types
const props = defineProps<arrays_sidebar_main>();
import type { arrays_sidebar_main, provide_everything } from "../../../helper/types";

// filterState получается через inject
const filterState = inject("filterState") as provide_everything;

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
  <input type="text" class="search" placeholder="Nike Air Max Plus" @input="handleinput($event)" />
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
}

:focus {
    outline: solid 1px var(--text-a);
}

::placeholder {
  color: var(--text-c);
}
</style>
