<script setup lang="ts">
// vue
import { computed, onMounted, watch, ref } from "vue";

// components
import loading_main from "../../common/loading/loading_main.vue";
import wrapper_main from "../../common/wrapper/wrapper_main.vue";
import header_main from "../../common/header/header_main.vue";
import basket_item from "./basket_item.vue";

// pinia & supabase
import { useGlobalState } from "../../helper/pinia";
import { supabase } from "../../helper/imp/supabase";
import { updateUserField } from "../../helper/actions";
const global = useGlobalState();

// types
import type { sneaker_color, product_item } from "../../helper/types";

// state
const loading = ref(true);
const error = ref<string | null>(null);
const sneakersMap = ref<Map<number, any>>(new Map());

// Функция для получения переведенного текста
function getTranslatedText(key: string) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(`--${key}`);
  return value ? value.replace(/^"(.*)"$/, '$1') : key;
}

// Функция для получения переведенной валюты
function getTranslatedRub() {
  const value = getComputedStyle(document.documentElement).getPropertyValue('--rub');
  return value ? value.replace(/^"(.*)"$/, '$1') : 'rub';
}

// загрузка всех кроссовок (для отображения корзины)
async function loadSneakers() {
  loading.value = true;
  error.value = null;
  try {
    const { data, error: supabaseError } = await supabase.from("sneakers").select("*");
    if (supabaseError) throw supabaseError;

    const map = new Map<number, any>();
    data?.forEach((item) => map.set(item.id, item));
    sneakersMap.value = map;
  } catch (err: any) {
    console.error("Ошибка загрузки корзины:", err);
    error.value = err.message ?? String(err);
  } finally {
    loading.value = false;
  }
}

// вычисляемая корзина напрямую из Pinia
const basketItems = computed(() => {
  const user = global.user;
  if (!user) return [];
  if (!user.basket || user.basket.length === 0) return [];

  return user.basket
    .map((basketItem: product_item) => {
      const sneaker = sneakersMap.value.get(basketItem.id);
      if (!sneaker) return null;
      const colors = sneaker.colors as sneaker_color[];
      const colorIndex = typeof basketItem.color === "number" ? basketItem.color : colors.findIndex((c) => c.name === basketItem.color);
      return {
        ...sneaker,
        favouriteColor: colorIndex >= 0 ? colorIndex : 0,
        favouriteSize: basketItem.size,
      };
    })
    .filter(Boolean);
});

// ----------------------
// удаление элемента из корзины
async function handleItemRemoved(itemId: number, colorIndex: number, size: string) {
  const user = global.user;
  if (!user) return;

  const updatedBasket = user.basket.filter((item: product_item) => {
    const sameId = item.id === itemId;
    const sameSize = item.size === size;
    
    // Сравниваем цвет через индекс или имя
    const itemColorIndex = typeof item.color === "number" 
      ? item.color 
      : sneakersMap.value.get(item.id)?.colors?.findIndex((c: any) => c.name === item.color) ?? -1;
    
    return !(sameId && sameSize && itemColorIndex === colorIndex);
  });

  if (user.id === "Guest") {
    global.updateUserField("basket", updatedBasket);
  } else {
    await updateUserField("basket", updatedBasket);
  }
}

// общая стоимость
const totalCost = computed(() => {
  return basketItems.value.reduce((sum, item) => sum + (item.cost || 0), 0);
});

// 📦 ПЕРЕМЕЩЕНИЕ КОРЗИНЫ В ИСТОРИЮ ЗАКАЗОВ
async function moveBasketToHistory() {
  const user = global.user;
  if (!user || !user.basket || user.basket.length === 0) return;
  
  try {
    const order = {
      id: Date.now(),
      date: new Date().toISOString(),
      items: [...user.basket],
      total: totalCost.value,
      status: 'completed' as const
    };

    const updatedHistory: any = user.history ? [...user.history, order] : [order];
    
    if (user.id === "Guest") {
      // Для гостя обновляем локально
      global.updateUserField("history", updatedHistory);
      global.updateUserField("basket", []);
    } else {
      // Для авторизованного пользователя обновляем в БД
      await updateUserField("history", updatedHistory);
      await updateUserField("basket", []);
    }
    
    console.log('✅ Заказ успешно перемещен в историю');
  } catch (err: any) {
    console.error('❌ Ошибка при оформлении заказа:', err);
    error.value = err.message ?? String(err);
  }
}

// монтирование и отслеживание изменений
onMounted(() => {
  loadSneakers();
});

// следим за изменением корзины
watch(
  () => global.user?.basket,
  () => {
    if (global.user) loadSneakers();
  },
  { deep: true }
);
</script>

<template>
  <wrapper_main>
    <header_main />
    <main>
      <div :class="loading || basketItems.length === 0 ? 'center' : 'normal'">
        <div v-if="loading" class="loa">
          <loading_main />
        </div>
        <basket_item v-else-if="basketItems.length > 0" v-for="item in basketItems" :key="`${item.id}-${item.favouriteColor}-${item.favouriteSize}`" :data="item" @item-removed="handleItemRemoved" />
        <div v-else-if="!loading && basketItems.length === 0" class="loa">
          <img src="/public/gif/evernight.gif" alt="No items" />
          <p> {{ getTranslatedText('emptyBasket') }} </p>
        </div>
      </div>
      <div class="right" v-if="!loading && basketItems.length > 0">
        <div
          class="vfv"
          v-for="value in basketItems"
          :key="`${value.id}-${value.favouriteColor}-${value.favouriteSize}`"
        >
          <div class="name">{{ value.name }}</div>
          <div class="cost">{{ value.cost }} {{ getTranslatedRub() }}</div>
        </div>
        <button 
          class="finalcost" 
          @click="moveBasketToHistory()" 
          :disabled="!global.user || global.user.id === 'Guest'"
        >
          {{ getTranslatedText('makePurchase') }} {{ totalCost }} {{ getTranslatedRub() }}
        </button>
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

  .normal {
    width: calc(100% - 28rem);
    padding: 1rem;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
  }
  .center {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  ::-webkit-scrollbar {
    display: none;
  }

  .right {
    min-width: unset;
    width: 28rem;
    height: 100%;
    border-left: solid 2px var(--bg-c);
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    overflow: scroll;

    .vfv {
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      display: flex;
      justify-content: space-between;
      background: var(--bg-c);
    }

    .finalcost {
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      background: var(--text-b);
      color: var(--bg-a);
      text-align: center;
      cursor: pointer;
      margin-top: 1rem;
      font-weight: bold;
    }
  }

  .loa {
    p {
      width: 20rem;
      text-align: center;
    }
  }
}

/* Планшеты */
@media (max-width: 1024px) {
  main {
    flex-direction: column-reverse;

    .right {
      width: 100%;
      height: 14rem;
      overflow: scroll;
    }::-webkit-scrollbar {
      display: none;
    }

    .normal {
      width: 100%;
      height: 100%;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.8rem;
      padding: 0.8rem;
    }
  }
}

/* Маленькие планшеты */
@media (max-width: 768px) {
  main {
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
}

/* Телефоны */
@media (max-width: 480px) {
  main {
    .normal {
      grid-template-columns: 1fr;
      gap: 0.5rem;
      padding: 0.5rem;
    }

    .right {
      font-size: 0.75rem;
    }

    .loa p {
      width: 14rem;
      font-size: 0.8rem;
    }
  }
}

/* Маленькие телефоны */
@media (max-width: 360px) {
  main {
    .normal {
      padding: 0.4rem;
      gap: 0.4rem;
    }

    .loa p {
      width: 12rem;
      font-size: 0.75rem;
    }
  }
}
</style>
