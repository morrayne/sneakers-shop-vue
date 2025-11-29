<script setup lang="ts">
// vue
import { ref, onMounted, watch } from "vue";

// types
import type { product_item } from "../../helper/types";

// components
import loading_main from "../../common/loading/loading_main.vue";
import wrapper_main from "../../common/wrapper/wrapper_main.vue";
import header_main from "../../common/header/header_main.vue";
import favourite_item from "./favourite_item.vue";

// pinia & supabase
import { useGlobalState } from "../../helper/pinia";
import { supabase } from "../../helper/imp/supabase";
const global = useGlobalState();

// state & vars
const loading = ref(true);
const error = ref<string | null>(null);
const sneakers = ref<any>([]);

// загрузка избранного
async function fetchFavs() {
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

// удаление элемента
async function handleItemRemoved(removedItem: product_item) {
  if (global.user?.favourite) {
    global.user.favourite = global.user.favourite.filter(
      (item: product_item) =>
        item.id !== removedItem.id || item.color !== removedItem.color
    );
    if (global.user.id !== "Guest") {
      try {
        const { error } = await supabase
          .from("profiles")
          .update({ favourite: global.user.favourite })
          .eq("id", global.user.id);
        if (error) {
          console.error("Ошибка синхронизации:", error);
        }
      } catch (err: any) {
        console.error("Ошибка при обновлении:", err);
      }
    }
  }
}

// монтирование
onMounted(() => fetchFavs());

// следим за изменением пользователя или избранного
watch(
  () => global.user?.favourite,
  () => {
    if (global.user && global.user.id === "Guest") {
      return;
    } else {
      fetchFavs();
    }
  },
  { deep: true }
);

function getTranslatedText(key: string) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(
    `--${key}`
  );
  return value ? value.replace(/^"(.*)"$/, "$1") : key;
}
</script>

<template>
  <wrapper_main>
    <header_main />
    <main
      :class="
        loading || !global.user || global.user.favourite?.length === 0
          ? 'center'
          : 'normal'
      "
    >
      <div v-if="loading" class="loa">
        <loading_main />
      </div>
      <favourite_item
        v-else-if="
          !loading && global.user && global.user.favourite?.length !== 0
        "
        v-for="item in global.user?.favourite"
        :key="`${item.id}-${item.color}`"
        :data="item"
        :sneaker="sneakers.find((s: any) => s.id === item.id)"
        @item-removed="handleItemRemoved"
      />
      <div
        v-else-if="
          !loading &&
          (!global.user ||
            !global.user.favourite ||
            global.user.favourite.length === 0)
        "
        class="loa"
      >
        <img src="/public/gif/evernight.gif" alt="No items" />
        <p>{{ getTranslatedText("emptyFavourite") }}</p>
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
  overflow: scroll;
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
  display: flex;
  flex-direction: column;
  align-items: center;
}

.center {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center !important;
  align-items: center !important;
}

/* Планшеты */
@media (max-width: 1024px) {
  .normal {
    width: 100%;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.8rem;
    padding: 0.8rem;
  }

  .right {
    display: none;
  }
}

/* Маленькие планшеты */
@media (max-width: 768px) {
  .normal {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.6rem;
    padding: 0.6rem;
  }

  .loa p {
    width: 16rem;
    font-size: 0.9rem;
  }
}

/* Телефоны */
@media (max-width: 480px) {
  .normal {
    grid-template-columns: 1fr;
    gap: 0.5rem;
    padding: 0.5rem;
  }

  .loa p {
    width: 14rem;
    font-size: 0.8rem;
  }
}

/* Маленькие телефоны */
@media (max-width: 360px) {
  .normal {
    padding: 0.4rem;
    gap: 0.4rem;
  }

  .loa p {
    width: 12rem;
    font-size: 0.75rem;
  }
}
</style>
