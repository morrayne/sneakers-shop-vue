<script setup lang="ts">
// vue
import { ref } from "vue";

// supabase
import { supabase } from "../../helper/supabase";

// pinia
import { useGlobalState } from "../../helper/pinia";
const global = useGlobalState();

// vars
const sizes = [
  "40.0",
  "40.5",
  "41.0",
  "41.5",
  "42.0",
  "42.5",
  "43.0",
  "43.5",
  "44.0",
];
const loading = ref(false);

// props
const props = defineProps<{
  data: any;
}>();

// emits
const emit = defineEmits<{
  itemRemoved: [id: number];
}>();

// удаление из избранного
async function removeFromFavourite() {
  if (loading.value) return;

  try {
    loading.value = true;

    // Создаем новый массив без удаляемого элемента
    const updatedFavourites = global.user.favourite.filter(
      (item: any) =>
        !(item.id === props.data.id && item.color === props.data.favouriteColor)
    );

    // Обновляем в базе данных
    const { error } = await supabase
      .from("profiles")
      .update({ favourite: updatedFavourites })
      .eq("id", global.user.id);

    if (error) throw error;

    // Обновляем локальное состояние
    global.user.favourite = updatedFavourites;

    // Отправляем событие родителю
    emit("itemRemoved", props.data.id);

    console.log("Товар удален из избранного");
  } catch (error) {
    console.error("Ошибка при удалении из избранного:", error);
    alert("Не удалось удалить товар из избранного");
  } finally {
    loading.value = false;
  }
}

// выбор размера
async function selectSize(size: string) {
  try {
    // Создаем обновленный массив с новым размером
    const updatedFavourites = global.user.favourite.map((item: any) => {
      if (
        item.id === props.data.id &&
        item.color === props.data.favouriteColor
      ) {
        return { ...item, size: size };
      }
      return item;
    });

    // Обновляем в базе данных
    const { error } = await supabase
      .from("profiles")
      .update({ favourite: updatedFavourites })
      .eq("id", global.user.id);

    if (error) throw error;

    // Обновляем локальное состояние
    global.user.favourite = updatedFavourites;

    console.log("Размер обновлен:", size);
  } catch (error) {
    console.error("Ошибка при обновлении размера:", error);
    alert("Не удалось обновить размер");
  }
}

// 
async function moveToBasket() {
  try {
    // Добавляем в корзину
    const basketItem = {
      id: props.data.id,
      color: props.data.favouriteColor,
      size: props.data.favouriteSize || sizes[0] // используем текущий размер или первый по умолчанию
    };
    
    const updatedBasket = [...global.user.basket, basketItem];
    
    // Удаляем из избранного
    const updatedFavourites = global.user.favourite.filter(
      (item: any) =>
        !(item.id === props.data.id && item.color === props.data.favouriteColor)
    );

    // Обновляем в базе данных
    const { error } = await supabase
      .from("profiles")
      .update({ 
        favourite: updatedFavourites,
        basket: updatedBasket
      })
      .eq("id", global.user.id);

    if (error) throw error;

    // Обновляем локальное состояние
    global.user.favourite = updatedFavourites;
    global.user.basket = updatedBasket;

    // Отправляем событие родителю
    emit("itemRemoved", props.data.id);

    console.log("Товар перемещен в корзину");
  } catch (error) {
    console.error("Ошибка при перемещении в корзину:", error);
    alert("Не удалось переместить товар в корзину");
  }
}

setTimeout(() => {
  console.log(props.data);
}, 1000);
</script>

<template>
  <div class="item" v-if="data">
    <div class="img-wrapper">
      <button class="bin" @click="removeFromFavourite" :disabled="loading">
        <img src="/public/svg/bin.svg" alt="" />
      </button>
      <div class="tag">{{ data.colors[data.favouriteColor].name }}</div>
      <img
        :src="`../../../public/sneakers/${data.id}-${
          data.colors[data.favouriteColor].folder_name
        }/0.jpg`"
        alt=""
      />
    </div>
    <div class="details">
      <div class="name">{{ data.name }}</div>
      <div class="sizes">
        <div
          :class="{ size: true, active: size === data.favouriteSize }"
          v-for="size in sizes"
          :key="size"
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
