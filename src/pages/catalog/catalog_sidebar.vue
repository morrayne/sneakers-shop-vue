<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import catalog_sidebar_item from "./catalog_sidebar_item.vue";
import catalog_sidebar_colors from "./catalog_sidebar_colors.vue";

const filtersColor = ref("all");
type FilterKeys = "sortBy" | "gender" | "brand";
const data: { name: string; key: FilterKeys; vals: string[] }[] = [
  { name: "Sort By", key: "sortBy", vals: ["id", "brand", "rating", "gender", "cost"] },
  { name: "Gender", key: "gender", vals: ["uni", "male", "female"] },
  { name: "Brand", key: "brand", vals: ["all", "nike", "new balance", "reebok", "vans"] },
];

const emit = defineEmits<{
  (e: "filter-change", value: Record<string, string>): void;
  (e: "search-change", value: string): void;
}>();

const props = defineProps<{
  sneakers: any[];
}>();

const filters = reactive<Record<FilterKeys, string>>({
  sortBy: "id",
  gender: "uni",
  brand: "all",
});

// синхронизация цвета с родителем
watch(filtersColor, (val) =>
  emit("filter-change", { ...filters, colors: val })
);

function handleChange(key: FilterKeys, value: string) {
  filters[key] = value;
  emit("filter-change", { ...filters, colors: filtersColor.value });
}

function onSearchInput(event: Event) {
  const target = event.target as HTMLInputElement | null;
  if (target) emit("search-change", target.value);
}
</script>

<template>
  <div class="sidebar">
    <input type="text" class="search" placeholder="Nike Air Max 95" @input="onSearchInput" />
    <catalog_sidebar_item v-for="block in data" :key="block.key" :data="block" v-model="filters[block.key]" @update:modelValue="(val) => handleChange(block.key, val)" />
    <catalog_sidebar_colors :sneakers="sneakers" v-model="filtersColor" />
  </div>
</template>

<style scoped lang="scss">
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 1rem 0.5rem;

  .search {
    background: var(--extra-bg);
    padding: 0.5rem;
    border-radius: 0.5rem;
    outline: none;
    border: none;
    color: var(--main-text);
  }
}
</style>
