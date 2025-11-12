<script setup lang="ts">
import { ref, onMounted, watch } from "vue";

// types
import type { sneaker_color } from "../../helper/types";

// components
import loading_main from "../../common/loading/loading_main.vue";
import wrapper_main from "../../common/wrapper/wrapper_main.vue";
import header_main from "../../common/header/header_main.vue";
import favourite_item from "./favourite_item.vue";

// pinia & supabase
import { useGlobalState } from "../../helper/pinia";
import { supabase } from "../../helper/supabase";

const global = useGlobalState();

// state
const fav_array = ref<any[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

// загрузка избранного
async function fetchFavs() {
  if (!global.user.id || global.user.id === "filler") {
    fav_array.value = [];
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const { data, error: supabaseError } = await supabase
      .from("sneakers")
      .select("*");
    if (supabaseError) throw supabaseError;

    const sneakersMap = new Map<number, any>();
    data?.forEach((item) => sneakersMap.set(item.id, item));

    fav_array.value = global.user.favourite
      .map((fav) => {
        const sneaker = sneakersMap.get(fav.id);
        if (!sneaker) return null;

        const colorIndex = (sneaker.colors as sneaker_color[]).findIndex(
          (c: sneaker_color) => c.name === fav.color
        );

        return {
          ...sneaker,
          favouriteColor: colorIndex >= 0 ? colorIndex : 0,
          favouriteSize: fav.size,
        };
      })
      .filter(Boolean);
  } catch (err: any) {
    console.error("Ошибка загрузки избранного:", err);
    error.value = err.message ?? String(err);
  } finally {
    loading.value = false;
  }
}

// обработчик удаления элемента
function handleItemRemoved(itemId: number) {
  fav_array.value = fav_array.value.filter((item) => item.id !== itemId);
}

// следим за изменением пользователя или избранного
watch(
  () => [global.user.id, global.user.favourite],
  () => fetchFavs(),
  { deep: true }
);

// монтирование
onMounted(fetchFavs);
</script>

<template>
  <wrapper_main>
    <header_main />
    <main :class="fav_array.length === 0 ? 'center' : 'normal'">
      <div v-if="loading" class="loa">
        <loading_main />
      </div>

      <favourite_item
        v-else
        v-for="item in fav_array"
        :key="`${item.id}-${item.favouriteColor}`"
        :data="item"
        @item-removed="handleItemRemoved"
      />

      <div v-if="!loading && fav_array.length === 0" class="loa">
        <img src="/public/gif/evernight.gif" alt="No items" />
        <p v-if="global.user.id !== 'filler'">No sneakers in favourite</p>
        <p v-else>You are not authorized</p>
      </div>
    </main>
  </wrapper_main>
</template>

<style scoped lang="scss">
main {
  height: 100%;
  display: flex;
  overflow: hidden;

  .normal,
  .center {
    overflow: scroll;
    height: 100%;
  }
}
.normal {
  width: calc(100% - 28rem);
  padding: 1rem;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

::-webkit-scrollbar {
  display: none;
}

.right {
  min-width: unset;
  width: 28rem;
  height: 100%;
  border-left: solid 2px var(--bg-b);
}

.loa {
  p {
    width: 20rem;
    text-align: center;
  }
}
.center {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
