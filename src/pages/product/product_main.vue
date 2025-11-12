<!-- prettier-ignore -->
<script setup lang="ts">
// vue
import { ref, reactive, onMounted, watch } from "vue";

// pinia
import { useGlobalState } from "../../helper/pinia";
const global = useGlobalState();

// supabase
import { supabase } from "../../helper/supabase";

// components
import header_main from "../../common/header/header_main.vue";
import wrapper_main from "../../common/wrapper/wrapper_main.vue";
import product_filler from "./product_filler.vue";

// router
import { useRoute } from "vue-router";
const route = useRoute();

// vars
const loading = ref(true);
const productId = ref<string>("");
const product = ref<any>(null);
const selected = reactive({
  main_photo: 0,
  color: 0,
  size: "40.0",
});
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

// добваление в избранное
async function addToFavourite(user_id: string, product_id: number) {
  if (!user_id || user_id === "filler") return;
  try {
    const { data: userData, error: fetchError } = await supabase.from("profiles").select("favourite").eq("id", user_id).single();
    if (fetchError) throw fetchError;
    const current = userData?.favourite ?? [];
    const exists = current.some(
      (item: any) =>
        item.id === product_id &&
        item.color === selected.color &&
        item.size === selected.size
    );
    const updated = exists
      ? current.filter(
          (item: any) =>
            !(
              item.id === product_id &&
              item.color === selected.color &&
              item.size === selected.size
            )
        )
      : [...current, { id: product_id, color: selected.color, size: selected.size }];
    const { data: updatedData, error: updateError } = await supabase.from("profiles").update({ favourite: updated }).eq("id", user_id).select();
    if (updateError) throw updateError;
  } catch (err) {
    console.error("Ошибка при обновлении избранного:", err);
  }
}

// Добавление в корзину
async function addToBasket(user_id: string, product_id: number) {
  if (!user_id || user_id === "filler") return;
  try {
    const { data: userData, error: fetchError } = await supabase.from("profiles").select("basket").eq("id", user_id).single();
    if (fetchError) throw fetchError;
    const current = userData?.basket ?? [];
    const exists = current.some(
      (item: any) =>
        item.id === product_id &&
        item.color === selected.color &&
        item.size === selected.size
    );
    const updated = exists? current.filter(
          (item: any) =>
            !(
              item.id === product_id &&
              item.color === selected.color &&
              item.size === selected.size
            )
        )
      : [...current, { id: product_id, color: selected.color, size: selected.size }];
    const { data: updatedData, error: updateError } = await supabase.from("profiles").update({ basket: updated }).eq("id", user_id).select();
    if (updateError) throw updateError;
  } catch (err) {
    console.error("Ошибка при обновлении корзины:", err);
  }
}

// Восстановление пользователя после F5
onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user) {
    const { data: profileData } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
    if (profileData) Object.assign(global.user, profileData);
  }
  productId.value = route.params.id as string;
  fetchProduct();
});
</script>

<!-- prettier-ignore -->
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
          <button class="cart" :disabled="global.user.id === 'filler'" @click="addToBasket(global.user.id, product.id)">
            <img src="/svg/bag.svg" alt="" />
            <span @click="addToFavourite(global.user.id, product.id)">Add to cart</span>
          </button>
          <button class="favourite" :disabled="global.user.id === 'filler'" @click="addToFavourite(global.user.id, product.id)">
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
