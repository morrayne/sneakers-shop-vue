<script setup lang="ts">
import { ref } from "vue";
import type { catalogItem } from "../../helper/types";
import catalog_card_img from "./catalog_card_img.vue";

const props = defineProps<{ data: catalogItem }>();
const currentColorIndex = ref(props.data.displayColor || 0);

function setColor(index: number) {
  currentColorIndex.value = index;
}
</script>

<template>
  <div class="card">
    <catalog_card_img :colors="props.data.colors" :productId="props.data.id" :currentIndex="currentColorIndex" @color-change="setColor" />
    <p class="name">{{ props.data.name }}</p>
    <p class="sub-name">
      {{ props.data.colors[currentColorIndex].name }}
    </p>
    <div class="tags-holder">
      <div class="tag">{{ props.data.brand }}</div>
      <div class="tag">{{ props.data.gender }}</div>
    </div>
    <div class="btn">
      {{ `${props.data.cost} rub` }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.card {
  height: fit-content;
  background: var(--extra-bg);
  padding: 1rem;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  .name {
    font-size: 1rem;
    font-weight: 700;
    color: var(--main-text);
  }

  .sub-name {
    font-size: 0.8rem;
    color: var(--extra-text);
  }

  .tags-holder {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;

    .tag {
      font-size: 0.8rem;
      background: var(--extra-bg);
      filter: brightness(0.9);
      padding: 0.2rem 0.5rem;
      border-radius: 0.5rem;
      cursor: pointer;
    }
  }

  .btn {
    text-align: center;
    margin-top: 0.25rem;
    padding: 0.25rem 0;
    border-radius: 0.5rem;
    background: var(--sub-text);
    color: var(--main-bg);
    cursor: pointer;
  }
}
</style>
