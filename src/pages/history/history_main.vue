<script setup lang="ts">
// vue
import { ref, onMounted } from "vue";

// components
import wrapper_main from "../../common/wrapper/wrapper_main.vue";
import header_main from "../../common/header/header_main.vue";
import history_item from "./history_item.vue";

// pinia & supabase
import { supabase } from "../../helper/imp/supabase";
import { useGlobalState } from "../../helper/pinia";
const global = useGlobalState();

// state & vars
const loading = ref(true);
const error = ref<string | null>(null);
const sneakers = ref<any>([]);

// history
async function fetchHistory() {
  loading.value = true;
  error.value = null;
  try {
    const { data, error: supabaseError } = await supabase
      .from("sneakers")
      .select("*");
    sneakers.value = data;
    if (supabaseError) throw supabaseError;
  } catch (err: any) {
    console.error("Ошибка загрузки избранного:", err);
    error.value = err.message ?? String(err);
  } finally {
    loading.value = false;
  }
}

onMounted(fetchHistory);
</script>

<template>
  <wrapper_main>
    <header_main />
    <main :class="loading ? 'center' : 'default'">
      <div v-if="loading" class="loa">
        <p>Загрузка истории...</p>
      </div>
      <div v-else-if="!global.user?.history || global.user.history.length === 0" class="loa">
        <img src="/public/gif/evernight.gif" alt="No items" />
        <p>История заказов пуста</p>
      </div>
      <history_item
        v-else
        v-for="order in global.user.history"
        :key="order.id"
        :order="order"
        :sneakers="sneakers"
      />
    </main>
  </wrapper_main>
</template>

<style scoped lang="scss">
main {
  display: flex;
  padding: 1rem;
  overflow: scroll;
}::-webkit-scrollbar {
  display: none;
}
.center {
  align-items: center;
  justify-content: center;
}
.default {
  flex-direction: column-reverse;
  gap: 1.5rem;

  .loa {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
</style>