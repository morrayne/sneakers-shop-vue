<script setup lang="ts">
// vue
import { ref, onMounted, inject, computed } from 'vue';

// supabase & types
import { supabase } from '../../../helper/imp/supabase';
import type { provide_everything } from '../../../helper/types';

// imports
import list_filler from '../fillers/list_filler.vue';
import list_card_main from './list_card_main.vue';

// vars
const sneakers = ref<any[]>([]);
const loading = ref<boolean>(true);
const filterState = inject('filterState') as provide_everything;
if (!filterState) throw new Error("filterState is undefined! Проверьте provide в родителе.");

// загрузка данных
async function fetchSneakers() {
  loading.value = true;
  try {
    const { data, error } = await supabase.from("sneakers").select("*");
    if (error) throw error;
    if (data) sneakers.value = data;
  } catch (err) {
    console.error("Ошибка загрузки sneakers:", err);
  } finally {
    if (sneakers.value.length === 0) return
    loading.value = false;
  }
}

// при монтировании компонента запрос кроссовков
onMounted(() => { fetchSneakers() });

// вычисляемый массив с фильтрацией & поиском & сортировкой
const displayedSneakers = computed(() => {
  let result = [...sneakers.value];
  const f = filterState.state.filters;
  if (f.color !== 'all') {
    const wanted = f.color;
    result = result.filter(item => Array.isArray(item.colors) && item.colors.some((c: any) => (c?.folder_name ?? c) === wanted));
  }
  if (f.brand !== 'all') { result = result.filter(item => item.brand === f.brand) }
  if (f.gender !== 'all') { result = result.filter(item => item.gender === f.gender) }
  if (filterState.state.search) {
    const s = filterState.state.search.toLowerCase();
    result = result.filter(item => item.name.toLowerCase().includes(s) || item.brand.toLowerCase().includes(s));
  }
  const sortKey = filterState.state.sortBy;
  const sortOrder = filterState.state.sortOrder;
  result.sort((a, b) => {
    let valA = a[sortKey];
    let valB = b[sortKey];
    if (typeof valA === 'number' && typeof valB === 'number') { return sortOrder === 'asc' ? valA - valB : valB - valA }
    if (typeof valA === 'string' && typeof valB === 'string') { return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA) }
    if (valA == null && valB != null) return sortOrder === 'asc' ? -1 : 1;
    if (valA != null && valB == null) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
  return result;
});
</script>

<template>
  <list_filler v-if="loading && displayedSneakers.length !== 0" v-for="value in 20" :key="value" />
  <list_card_main v-else-if="!loading && displayedSneakers.length !== 0" v-for="item in displayedSneakers" :key="item.id" :data="item" class="card" />
  <div class="ever" v-else>
    <img src="/public/gif/evernight.gif" alt="Анимация" />
    <p></p>
  </div>
</template>

<style scoped lang="scss">
.ever {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  img {
    max-width: 20rem;
  }

  p {
    &::before {
      content: var(--noFilters, "Ничего не найдено");
    }
  }
}

.ever {
  p {
    content: var(--noFilters, "Ничего не найдено");
  }
}
</style>
