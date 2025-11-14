<script setup lang="ts">
// vue
import { ref } from "vue";

// pinia 
import { useGlobalState } from "../../helper/pinia";
import { updateUserField } from "../../helper/actions";
const global = useGlobalState();

// props & emits
const props = defineProps<{ data: any }>();
const emit = defineEmits<{ "item-removed": [id: number, colorIndex: number, size: string] }>();

// vars
const loading = ref(false);

// функция удаления из корзины
async function removeFromBasket() {
  if (loading.value) return;
  loading.value = true;
  try {
    const { id, favouriteColor, favouriteSize, colors } = props.data;
    const colorName = colors[favouriteColor]?.name;
    const updatedBasket = global.user.basket.filter((item) => {
      const sameId = item.id === id;
      const sameSize = item.size === favouriteSize;
      const itemColorStr = typeof item.color === "number" ? colors[item.color].name : (item.color as string);
      return !(sameId && sameSize && itemColorStr === colorName);
    });
    await updateUserField("basket", updatedBasket);
    global.user.basket = updatedBasket;
    emit("item-removed", id, favouriteColor, favouriteSize);
    console.log("✅ Удалено:", id, colorName, favouriteSize);
  } catch (err: any) {
    console.error("❌ Ошибка при удалении:", err.message ?? err);
    alert("Не удалось удалить товар");
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="item" v-if="data">
    <div class="img-wrapper">
      <button class="bin" @click="removeFromBasket" :disabled="loading">
        <img src="/public/svg/bin.svg" alt="Delete" />
      </button>
      <div class="tag">{{ data.colors[data.favouriteColor]?.name }}</div>
      <img :src="`/sneakers/${data.id}-${data.colors[data.favouriteColor]?.folder_name}/0.jpg`" :alt="data.name" />
    </div>
    <div class="details">
      <div class="name">{{ data.name }}</div>
      <div class="stags">
        <div class="stag">{{ data.gender }}</div>
        <div class="stag">{{ data.favouriteSize }}</div>
        <div class="stag">{{ data.rating }} / 100</div>
      </div>
      <div class="movetobasket">{{ data.cost }} rub</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.item {
  height: fit-content;
  border-radius: 1rem;
  background: var(--bg-c);
  display: flex;
  flex-direction: column;
  padding: 1rem;

  .img-wrapper {
    aspect-ratio: 6 / 5;
    position: relative;
    overflow: hidden;

    .bin {
      width: 2rem;
      height: 2rem;
      background: var(--bg-d);
      border-radius: 0.25rem;
      padding: 0.25rem;
      position: absolute;
      top: 0;
      right: 0;
      z-index: 2;
      cursor: pointer;

      img {
        width: 1.5rem;
        aspect-ratio: 1 / 1;
        margin: 0.25rem;
      }
    }

    img {
      position: absolute;
      bottom: 0;
      left: 0;
    }
  }

  .sdf {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    padding: 0.2rem 0.5rem;
    border-radius: 0.35rem;
    text-align: center;
    font-size: 0.8rem;
    color: var(--text-a);
    background: var(--bg-d);
  }

  .stags {
    display: flex;
    gap: 0.5rem;
    margin: 0 0 0.5rem;

    .stag {
      padding: 0.2rem 0.5rem;
      border-radius: 0.35rem;
      text-align: center;
      font-size: 0.8rem;
      color: var(--text-a);
      background: var(--bg-d);
    }
  }

  .name {
    margin: 0 0 0.5rem;
  }

  .movetobasket {
    width: 100%;
    border-radius: 0.5rem;
    text-align: center;
    padding: 0.35rem 0;
    background: var(--text-b);
    color: var(--bg-a);
    cursor: pointer;
  }
}
</style>
