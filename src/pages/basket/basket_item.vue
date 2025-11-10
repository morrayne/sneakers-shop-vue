<script setup lang="ts">
// vue
import { ref } from "vue";

// supabase
import { supabase } from "../../helper/supabase";

// pinia
import { useGlobalState } from "../../helper/pinia";
const global = useGlobalState();
const loading = ref(false);

// props
const props = defineProps<{
  data: any;
}>();

setTimeout(() => {
  console.log(props.data);
}, 2000);

// emits
const emit = defineEmits<{
  itemRemoved: [id: number];
}>();

// удаление из избранного
async function removeFromFavourite() {
  if (loading.value) return;
  try {
    loading.value = true;
    const updatedFavourites = global.user.basket.filter(
      (item: any) =>
        !(item.id === props.data.id && item.color === props.data.favouriteColor)
    );
    const { error } = await supabase
      .from("profiles")
      .update({ basket: updatedFavourites })
      .eq("id", global.user.id);
    if (error) throw error;
    global.user.basket = updatedFavourites;
    emit("itemRemoved", props.data.id);
  } catch (error) {
    console.error("Ошибка при удалении из избранного:", error);
    alert("Не удалось удалить товар из избранного");
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="item" v-if="data">
    <div class="img-wrapper">
      <div class="sdf">
        <div class="stag">{{ data.colors[data.favouriteColor].name }}</div>
      </div>
      <button class="bin" @click="removeFromFavourite" :disabled="loading">
        <img src="/svg/bin.svg" alt="Удалить" />
      </button>
      <div class="tag">{{ data.colors[data.favouriteColor].name }}</div>
      <img
        :src="`/sneakers/${data.id}-${
          data.colors[data.favouriteColor].folder_name
        }/0.jpg`"
        :alt="data.name"
      />
    </div>
    <div class="name">{{ data.name }}</div>
    <div class="stags">
      <div class="stag">{{ data.gender }}</div>
      <div class="stag">{{ data.favouriteSize }}</div>
      <div class="stag">{{ data.rating }} / 100</div>
    </div>
    <div class="movetobasket">{{ data.cost }} rub</div>
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
