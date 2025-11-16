<script setup lang="ts">
// vue
import { ref, reactive, onMounted, watch } from "vue";

// pinia & supabase
import { useGlobalState } from "../../helper/pinia";
const global = useGlobalState();
import { supabase } from "../../helper/imp/supabase";

// router & actions
import { updateUserField } from "../../helper/actions";
import { useRoute } from "vue-router";
const route = useRoute();

// components
import header_main from "../../common/header/header_main.vue";
import wrapper_main from "../../common/wrapper/wrapper_main.vue";
import product_filler from "./product_filler.vue";

// vars
const loading = ref(true);
const productId = ref<string>("");
const product = ref<any>(null);
const selected = reactive({ main_photo: 0, color: 0, size: "40.0" });
const sizes = ["40.0","40.5","41.0","41.5","42.0","42.5","43.0","43.5","44.0"];

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

// добавление в избранное
async function addToFavourite() {
  try {
    const product_id = product.value.id;
    const colorName = product.value.colors[selected.color].name;
    if (!global.user) return;
    const currentFavourite = global.user.favourite || [];
    const exists = currentFavourite.some((item: any) => item.id === product_id && item.color === colorName && item.size === selected.size);
    const updatedFavourite = exists ? currentFavourite.filter((item: any) => !(item.id === product_id && item.color === colorName && item.size === selected.size)) : [...currentFavourite, { id: product_id, color: colorName, size: selected.size }];
    if (global.user.id === "Guest") {
      global.user.favourite = updatedFavourite;
    } else {
      await updateUserField("favourite", updatedFavourite);
    }
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
    const currentBasket = global.user.basket || [];
    const exists = currentBasket.some((item: any) => item.id === product_id && item.color === colorName && item.size === selected.size);
    const updatedBasket = exists ? currentBasket.filter((item: any) => !(item.id === product_id && item.color === colorName && item.size === selected.size)): [...currentBasket, { id: product_id, color: colorName, size: selected.size }];
    if (global.user.id === "Guest") {
      global.user.basket = updatedBasket;
    } else {
      await updateUserField("basket", updatedBasket);
    } 
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
          <div class="tag">{{ product?.brand }}</div>
          <div class="tag">{{ product?.gender }}</div>
          <div class="tag">{{ product?.id }}</div>
        </div>
        <div class="main-img">
          <img :src="`/sneakers/${product?.id}-${product?.colors?.[selected.color]?.folder_name}/${selected.main_photo}.jpg`" alt="" />
        </div>
        <div class="img-wrapper">
          <div class="img-holder" v-for="value in 3" :key="value" @click="selected.main_photo = value - 1">
            <img :src="`/sneakers/${product?.id}-${product?.colors?.[selected.color]?.folder_name}/${value - 1}.jpg`" alt="" />
          </div>
          <div class="filler">see more</div>
        </div>
      </div>
      <div class="right">
        <div class="model-name">{{ product?.name }}</div>
        <div class="model-rating">
          {{ product?.rating }} / 100 on {{ (product?.rating % 3).toFixed(0) }} reviews
        </div>
        <div class="model-cost">{{ product?.cost }}.00 rub</div>
        <div class="model-colors">
          <div class="img-wrapper" v-for="(color, index) in product?.colors" :key="index" @click="selected.color = index">
            <img :src="`/sneakers/${product?.id}-${color.folder_name}/0.jpg`" />
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
            <span>Add to cart</span>
          </button>
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
</style>