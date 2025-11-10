<script setup lang="ts">
// vue
import { ref, onMounted, inject, computed } from 'vue';

// supabase
import { supabase } from '../../../helper/supabase';

// imports
import list_filler from '../fillers/list_filler.vue';
import list_card_main from './list_card_main.vue';

// vars
const sneakers = ref<any[]>([]);
const loading = ref<boolean>(true);

// inject состояния фильтров и поиска
const filterState = inject('filterState') as any;
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
    loading.value = false;
  }
}

// при монтировании компонента запрос кроссовков
onMounted(() => {
  fetchSneakers();
});

// вычисляемый массив с фильтрацией/поиском/сортировкой
const displayedSneakers = computed(() => {
  let result = [...sneakers.value];
  const f = filterState.state.filters;
  if (f.color !== 'all') {
    const wanted = f.color;
    result = result.filter(item =>
      Array.isArray(item.colors) &&
      item.colors.some((c: any) => (c?.folder_name ?? c) === wanted)
    );
  }
  if (f.brand !== 'all') {
    result = result.filter(item => item.brand === f.brand);
  }
  if (f.gender !== 'all') {
    result = result.filter(item => item.gender === f.gender);
  }
  if (filterState.state.search) {
    const s = filterState.state.search.toLowerCase();
    result = result.filter(item =>
      item.name.toLowerCase().includes(s) ||
      item.brand.toLowerCase().includes(s)
    );
  }
  const sortKey = filterState.state.sortBy;
  result.sort((a, b) => {
    const valA = a[sortKey];
    const valB = b[sortKey];
    if (typeof valA === 'number' && typeof valB === 'number') return valA - valB;
    if (typeof valA === 'string' && typeof valB === 'string') return valA.localeCompare(valB);
    return 0;
  });
  return result;
});
</script>

<template>
  <list_filler v-if="loading" v-for="value in 20" :key="value" />
  <list_card_main v-else v-for="item in displayedSneakers" :key="item.id" :data="item" class="card" />
</template>

<style scoped lang="scss">

</style>
