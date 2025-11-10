<script setup lang="ts">
// vue
import { ref, onMounted } from "vue";

// router
import router from "../../../helper/router";

// pinia
import { useGlobalState } from "../../../helper/pinia";
const global = useGlobalState();

// vars
const active_color = ref(0);

// props
const props = defineProps<{
  data: any;
}>();

// functions
function navigateToProduct() {
  router.push(`/product/${props.data.id}`);
}
function setActiveColor(val: any, event: Event) {
  event.stopPropagation(); 
  active_color.value = val;
}

// обработчик клика по кнопке цены
function handlePriceClick(event: Event) {
  event.stopPropagation();
  if (global.user.id !== 'filler') {
    console.log('Add to cart:', props.data);
  }
}

// монтирование
onMounted(() => {
  setActiveColor(props.data.displayColor, new Event('init'));
});
</script>

<template>
  <div class="card" @click="navigateToProduct">
    <div class="img-holder">
      <div class="color-wrapper">
        <button
          class="color"
          v-for="(value, index) in props.data.colors"
          v-if="props.data.colors.length !== 1"
          :key="value"
          :style="{ background: value.folder_name }"
          @click="setActiveColor(index, $event)"
        ></button>
        <div class="rating">{{ props.data.rating }} / 100</div>
      </div>
      <img
        :src="`./sneakers/${props.data.id}-${props.data.colors[active_color].folder_name}/1.jpg`"
        alt="product img"
      />
      <img
        :src="`./sneakers/${props.data.id}-${props.data.colors[active_color].folder_name}/0.jpg`"
        alt="product img"
        class="dis"
      />
    </div>
    <p class="name">{{ props.data.name }}</p>
    <p class="sub-name">{{ props.data.colors[active_color].name }}</p>
    <div class="tags-holder">
      <div class="tag">{{ props.data.brand }}</div>
      <div class="tag">{{ props.data.gender }}</div>
    </div>
    <button class="btn" :disabled="global.user.id === 'filler'" @click="handlePriceClick">
      {{ `${props.data.cost} rub` }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.card {
  height: fit-content;
  background: var(--bg-c);
  padding: 1rem;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  .name {
    font-size: 1rem;
    font-weight: 700;
    color: var(--text-a);
  }

  .img-holder {
    width: 100%;
    aspect-ratio: 6 / 5;
    position: relative;
    overflow: hidden;
    display: flex;

    .color-wrapper {
      width: 100%;
      height: fit-content;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      position: relative;
      z-index: 2;

      .color {
        height: 1rem;
        aspect-ratio: 1 / 1;
        border-radius: 0.375rem;
      }

      .rating {
        font-size: 0.8rem;
        color: var(--text-a);
        background: var(--bg-d);
        padding: 0.2rem 0.5rem;
        margin-left: auto;
        border-radius: 0.5rem;
        cursor: pointer;
      }
    }

    img {
      width: 100%;
      position: absolute;
      left: 0;
      bottom: 0;
      transition: 0.4s;
    }

    .dis:hover {
      opacity: 0;
    }
  }

  .sub-name {
    font-size: 0.8rem;
    color: var(--text-c);
  }

  .tags-holder {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;

    .tag {
      font-size: 0.8rem;
      color: var(--text-c);
      background: var(--bg-d);
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
    background: var(--text-b);
    color: var(--bg-a);
    cursor: pointer;
  }
  :disabled {
    cursor: not-allowed;
  }
}
</style>
