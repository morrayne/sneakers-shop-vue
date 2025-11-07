<script setup lang="ts">
// vue
import { reactive, onMounted } from "vue";

// fetch functions
import { fetchColors, fetchBrands, fetchGenders } from "./sidebar/sidebar_script";

// components
import header_main from "../../common/header/header_main.vue";
import wrapper_main from "../../common/wrapper/wrapper_main.vue";
import sidebar_main from "./sidebar/sidebar_main.vue";
import list_main from "./list/list_main.vue";

// vars
const color_array = reactive<string[]>([]);
const brand_array = reactive<string[]>([]);
const gender_array = reactive<string[]>([]);

// инициализация данных
async function initializeData() {
  const [colors, brands, genders] = await Promise.all([
    fetchColors(),
    fetchBrands(),
    fetchGenders()
  ]);
  color_array.push("all", ...colors);
  brand_array.push("all", ...brands);
  gender_array.push("all", ...genders);
}

// при монтировании компонента
onMounted(() => {
  initializeData();
});
</script>

<template>
  <wrapper_main>
    <header_main />
    <main>
      <div class="left">
        <sidebar_main :color_array="color_array" :brand_array="brand_array" :gender_array="gender_array" />
      </div>
      <div class="right">
        <list_main />
      </div>
    </main>
  </wrapper_main>
</template>

<style scoped lang="scss">
main {
  height: calc(100% - 4rem);
  display: flex;

  .left {
    width: 18rem;
    padding: 1rem;
    border-right: solid 0.125rem var(--extra-bg);
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow-y: scroll;
  }
  ::-webkit-scrollbar {
    display: none;
  }
  .right {
    width: calc(100% - 18rem);
  }
}
</style>
