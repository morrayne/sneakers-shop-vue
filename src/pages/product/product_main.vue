<script setup lang="ts">
// vue
import { ref, reactive, onMounted, watch } from "vue";

// pinia & supabase
import { useGlobalState } from "../../helper/pinia";
const global = useGlobalState();
import { supabase } from "../../helper/imp/supabase";

// router & actions
import { addToBasket as addToBasketAction, addToFavourites as addToFavouritesAction } from "../../helper/actions";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();

// components
import header_main from "../../common/header/header_main.vue";
import wrapper_main from "../../common/wrapper/wrapper_main.vue";
import product_filler from "./product_filler.vue";

// vars
const loading = ref(true);
const productId = ref<string>("");
const product = ref<any>(null);
const selected = reactive({ main_photo: 0, color: 0, size: "40.0" as string });
const quantity = ref<number>(1);
const sizes = ["40.0","40.5","41.0","41.5","42.0","42.5","43.0","43.5","44.0"];

// Функция для получения переведенного текста
function getTranslatedText(key: string) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(`--${key}`);
  return value ? value.replace(/^"(.*)"$/, '$1') : key;
}

// Получаем текущий товар
async function fetchProduct() {
  try {
    loading.value = true;
    if (!productId.value) return;
    const { data, error } = await supabase.from("sneakers").select("*").eq("id", productId.value).single();
    if (error) throw error;
    product.value = data;
  } catch (err) {
    console.error("Ошибка при получении продукта:", err);
  } finally {
    loading.value = false;
    console.log("Product:", product.value);
  }
}

// отслеживаем изменение id в URL
watch(() => route.params.id, (newId) => {
  productId.value = newId as string;
  fetchProduct();
});

// переход на каталог с применением фильтрации (нажатие по id — игнорируется)
function openCatalogFilter(type: 'brand' | 'gender' | 'color' | 'id', value: string | number) {
  if (type === 'id') return; // ничего не делаем при клике по id
  const query: any = {};
  // передаём только соответствующий фильтр в query
  query[type] = String(value);
  router.push({ path: '/catalog', query });
}

// добавление в избранное
async function addToFavourite() {
  try {
    const product_id = product.value.id;
    const colorName = product.value.colors[selected.color].name;
    if (!global.user) return;
    // Используем единый экшен для избранного
    await addToFavouritesAction({ id: product_id, color: colorName, size: selected.size });
  } catch (err) {
    console.error("❌ Ошибка при обновлении избранного:", err);
  }
}

// Добавление в корзину
async function addToBasket() {
  try {
    const product_id = product.value.id;
    const colorName = product.value.colors[selected.color].name;
    if (!global.user) return;
    // Используем общий экшен для корзины — он объединяет по id/color/size и учитывает quantity
    await addToBasketAction({ id: product_id, color: colorName, size: selected.size, quantity: quantity.value });
  } catch (err) {
    console.error("❌ Ошибка при обновлении корзины:", err);
  }
}

// восстановление сессии при f5
onMounted(async () => {
  productId.value = route.params.id as string;
  fetchProduct();
});
</script>

<template>
  <wrapper_main>
    <header_main />
    <product_filler v-if="loading" />
    <main v-else>
      <div class="left">
        <div class="tags">
          <div class="tag" @click.stop="openCatalogFilter('brand', product.brand)">{{ product.brand }}</div>
          <div class="tag" @click.stop="openCatalogFilter('gender', product.gender)">{{ product.gender }}</div>
          <div class="tag">{{ product.id }}</div>
        </div>
        <div class="main-img">
          <div class="colors-c" v-if="product.colors.length !== 1">
            <button class="c" v-for="(value, index) in product.colors" :style="{background: value.folder_name}" @click="selected.color = index"></button>
          </div>
          <img :src="`/sneakers/${product.id}-${product.colors?.[selected.color].folder_name}/${selected.main_photo}.jpg`" alt="" />
        </div>
        <div class="img-wrapper">
          <div class="img-holder" v-for="value in 3" :key="value" @click="selected.main_photo = value - 1">
            <img :src="`/sneakers/${product.id}-${product.colors?.[selected.color].folder_name}/${value - 1}.jpg`" alt="" />
          </div>
          <div class="filler" v-if="false">{{ getTranslatedText('seeMore') }}</div>
        </div>
      </div>
      <div class="right">
        <div class="model-name">{{ product.name }}</div>
        <div class="model-rating">
          {{ product.rating }} / 100 {{ getTranslatedText('on') }} {{ (product.rating % 3).toFixed(0) }} {{ getTranslatedText('reviews') }}
        </div>
        <div class="model-cost">{{ product.cost }}.00 {{ getTranslatedText('rub') }}</div>
        <div class="model-colors">
          <div class="img-wrapper" v-for="(color, index) in product.colors" :key="index" @click="selected.color = index">
            <img :src="`/sneakers/${product.id}-${color.folder_name}/0.jpg`" />
          </div>
        </div>
        <div class="model-sizes">
          <div :class="selected.size === value ? 'active-size' : 'size'" v-for="value in sizes" @click="selected.size = value">
            {{ value }}
          </div>
        </div>
       
        <div class="duo-button">
          <button class="cart" @click="addToBasket()">
            <img src="/svg/bag.svg" alt="" />
            <span>{{ getTranslatedText('addToCart') }}</span>
          </button>
          <div class="model-quantity">
            <button class="qty" @click="quantity = Math.max(1, quantity - 1)">-</button>
            <div class="qty-val">{{ quantity }}</div>
            <button class="qty" @click="quantity = Math.min(99, quantity + 1)">+</button>
          </div>
          <button class="favourite" @click="addToFavourite()">
            <img src="/svg/heart.svg" alt="" />
          </button>
        </div>
      </div>
    </main>
  </wrapper_main>
</template>

<style scoped lang="scss">
main {
  justify-content: center;
  gap: 4rem;
}

.model-quantity {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin: 0.8rem 0;
}

.model-quantity .qty {
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  border: none;
  background: var(--bg-c);
  color: var(--text-a);
  font-weight: 700;
  cursor: pointer;
}

.model-quantity .qty-val {
  min-width: 2rem;
  text-align: center;
  font-weight: 700;
}

.actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.duo-button {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
</style>