<script setup lang="ts">
import { ref } from "vue";
import { useGlobalState } from "../../helper/pinia";
import { updateUserField } from "../../helper/actions"; // 👈 ключевой импорт

const global = useGlobalState();
const props = defineProps<{ data: any }>();
const emit = defineEmits<{ itemRemoved: [id: number] }>();

const sizes = ["40.0","40.5","41.0","41.5","42.0","42.5","43.0","43.5","44.0"];
const loading = ref(false);

// 🗑️ удаление из избранного
async function removeFromFavourite() {
  if (loading.value) return;
  loading.value = true;
  try {
    const colorName = props.data.colors[props.data.favouriteColor]?.name;
    const updatedFavourites = global.user.favourite.filter(
      (item) => !(item.id === props.data.id && item.color === colorName)
    );

    await updateUserField("favourite", updatedFavourites);
    global.user.favourite = updatedFavourites;
    emit("itemRemoved", props.data.id);
  } catch (err) {
    console.error("Ошибка при удалении из избранного:", err);
    alert("Не удалось удалить товар из избранного");
  } finally {
    loading.value = false;
  }
}

// 📏 выбор размера
async function selectSize(size: string) {
  try {
    const colorName = props.data.colors[props.data.favouriteColor]?.name;
    const updatedFavourites = global.user.favourite.map((item) =>
      item.id === props.data.id && item.color === colorName ? { ...item, size } : item
    );

    await updateUserField("favourite", updatedFavourites);
    global.user.favourite = updatedFavourites;
  } catch (err) {
    console.error("Ошибка при обновлении размера:", err);
    alert("Не удалось обновить размер");
  }
}

// 🛒 перемещение в корзину
async function moveToBasket() {
  if (loading.value) return;
  loading.value = true;

  try {
    const colorName = props.data.colors[props.data.favouriteColor]?.name || "default";
    const size = props.data.favouriteSize || sizes[0];

    const basketItem = { id: props.data.id, color: colorName, size };

    const updatedBasket = [...global.user.basket, basketItem];
    const updatedFavourites = global.user.favourite.filter(
      (item) => !(item.id === props.data.id && item.color === colorName)
    );

    await updateUserField("basket", updatedBasket);
    await updateUserField("favourite", updatedFavourites);

    global.user.basket = updatedBasket;
    global.user.favourite = updatedFavourites;

    emit("itemRemoved", props.data.id);
  } catch (err) {
    console.error("Ошибка при перемещении в корзину:", err);
    alert("Не удалось переместить товар в корзину");
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="item" v-if="data">
    <div class="img-wrapper">
      <button class="bin" @click="removeFromFavourite" :disabled="loading">
        <img src="/public/svg/bin.svg" alt="Delete" />
      </button>
      <div class="tag">{{ data.colors[data.favouriteColor]?.name || "Unknown" }}</div>
      <img
        :src="`../../../public/sneakers/${data.id}-${data.colors[data.favouriteColor]?.folder_name || 'default'}/0.jpg`"
        alt="Sneaker"
      />
    </div>

    <div class="details">
      <div class="name">{{ data.name }}</div>

      <div class="sizes">
        <div
          v-for="size in sizes"
          :key="size"
          :class="{ size: true, active: size === data.favouriteSize }"
          @click="selectSize(size)"
        >
          {{ size }}
        </div>
      </div>

      <div class="duo">
        <div class="movetobasket" @click="moveToBasket">Move to basket</div>
      </div>
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

    .tag {
      padding: 0.2rem 0.5rem;
      border-radius: 0.35rem;
      text-align: center;
      font-size: 0.8rem;
      color: var(--text-a);
      background: var(--bg-d);
      position: absolute;
      z-index: 2;
    }

    img {
      position: absolute;
      bottom: 0;
      left: 0;
    }
  }

  .sizes {
    margin: 0.5rem 0 0;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 0.5rem;

    .size {
      padding: 0.2rem 0;
      border-radius: 0.35rem;
      text-align: center;
      font-size: 0.8rem;
      color: var(--text-a);
      background: var(--bg-c);
      filter: brightness(0.9);
      cursor: pointer;
    }

    .active {
      color: var(--bg-a);
      background: var(--text-b);
    }
  }

  .duo {
    margin: 0.5rem 0 0;
    display: flex;
    gap: 0.5rem;

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
}
</style>
