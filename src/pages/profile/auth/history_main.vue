<script setup lang="ts">
// vue
import { ref, onMounted, computed } from "vue";

// components
import history_item from "./history_item.vue";
import loading_main from "../../../common/loading/loading_main.vue";

// pinia & supabase
import { supabase } from "../../../helper/imp/supabase";
import { useGlobalState } from "../../../helper/pinia";
const global = useGlobalState();

// state & vars
const loading = ref(true);
const error = ref<string | null>(null);
const sneakers = ref<any>([]);

// Функция для получения переведенного текста
function getTranslatedText(key: string) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(`--${key}`);
  return value ? value.replace(/^"(.*)"$/, '$1') : key;
}

// Адаптируем историю под нужный формат
const adaptedHistory = computed(() => {
  if (!global.user?.history) return [];
  return global.user.history.map((order: any) => {
    if (order.items && order.date) { return order }
    return {
      id: order.id || Date.now(),
      date: order.date || new Date().toISOString(),
      items: Array.isArray(order) ? order : [order],
      total: order.total || 0,
      status: order.status || 'completed'
    };
  });
});

// history
async function fetchHistory() {
  loading.value = true;
  error.value = null;
  try {
    const { data, error: supabaseError } = await supabase.from("sneakers").select("*");
    sneakers.value = data;
    if (supabaseError) throw supabaseError;
  } catch (err: any) {
    console.error("Ошибка загрузки избранного:", err);
    error.value = err.message ?? String(err);
  } finally {
    loading.value = false;
  }
}

// при монтировании
onMounted(fetchHistory);
</script>

<template>
  <main :class="loading ? 'center' : 'default'">
    <div v-if="loading" class="loa">
      <loading_main />
    </div>
    <div v-else-if="!adaptedHistory || adaptedHistory.length === 0" class="loa">
      <img src="/public/gif/evernight.gif" alt="No items" />
      <p>{{ getTranslatedText('emptyOrderHistory') }}</p>
    </div>
    <div v-else class="history-list">
      <history_item v-for="order in adaptedHistory" :key="order.id" :order="order" :sneakers="sneakers" />
    </div>
  </main>
</template>

<style scoped lang="scss">
main {
  display: flex;
  padding: 1rem;
  overflow: scroll;
  
  &.center {
    align-items: center;
    justify-content: center;
  }
  
  &.default {
    height: 100%;
    flex-direction: column;
    gap: 1.5rem;

    .history-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
  }
}

.loa {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

::-webkit-scrollbar {
  display: none;
}
</style>
