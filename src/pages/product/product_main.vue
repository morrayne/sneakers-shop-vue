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

// vars
const selected = reactive({
  main_photo: 0,
  color: 0,
  size: '40.0',
})
const sizes = [ "40.0", "40.5", "41.0", "41.5", "42.0", "42.5", "43.0", "43.5", "44.0" ];

// router
import { useRoute } from "vue-router";
const route = useRoute();

// получаем id товара из URL
const productId = ref<string>("");
const product = ref<any>(null);

// получаем объект из таблицы
async function fetchProduct() {
  if (!productId.value) return;
  const { data, error } = await supabase.from("sneakers").select("*").eq("id", productId.value).single();
  if (error) {
    console.error("Error fetching product:", error);
    return;
  }
  product.value = data;
  console.log("Product data:", product.value);
}

// отслеживаем изменение id в URL
watch(() => route.params.id, (newId) => {
  productId.value = newId as string;
  fetchProduct();
});

// при монтировании
onMounted(() => {
  productId.value = route.params.id as string;
  fetchProduct();
});
</script>

<template>  
  <!-- prettier-ignore -->
  <wrapper_main>
    <header_main />
    <main>
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
        <div class="model-name">
          {{ product?.name }}
        </div>
        <div class="model-rating">
          {{ product?.rating }} / 100 on {{ (product?.rating % 3).toFixed(0) }} reviews
        </div>
        <div class="model-cost">
          {{ product?.cost }}.00 rub
        </div>
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
          <button class="cart" :disabled="global.user.id === 'filler'">
            <img src="/public/svg/bag.svg" alt="">
            <button>Add to cart</button>
          </button>
          <button class="favourite" :disabled="global.user.id === 'filler'">
            <img src="/public/svg/heart.svg" alt="">
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
