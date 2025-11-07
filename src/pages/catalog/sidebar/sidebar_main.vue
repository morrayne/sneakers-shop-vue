<script setup lang="ts">
// props
const props = defineProps<{
  color_array: any;
  brand_array: any;
  gender_array: any;
}>();

// components
import sidebar_main_filter from "./components/sidebar_main_filter.vue";
import sidebar_main_genders from "./components/sidebar_main_gender.vue";
import sidebar_main_colors from "./components/sidebar_main_colors.vue";
import sidebar_main_brands from "./components/sidebar_main_brand.vue";
</script>

<template>
  <input type="text" class="search" placeholder="Nike Air Max 95" />
  <sidebar_main_filter />
  <sidebar_main_colors :data_array="props.color_array" />
  <sidebar_main_genders :data_array="props.gender_array" />
  <sidebar_main_brands :data_array="props.brand_array" />
</template>

<style scoped lang="scss">
.search {
  width: 100%;
  background: var(--extra-bg);
  outline: solid 1px var(--extra-bg);
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  opacity: 1;
}:focus {
    outline: solid 1px var(--main-text);
}
::placeholder {
  color: var(--extra-text);
}
</style>
