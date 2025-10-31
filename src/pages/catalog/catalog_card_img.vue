<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  colors: any;
  productId: string | number;
  currentIndex: number;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  colorChange: [index: number];
}>();

const containerRef = ref<HTMLElement>();
const isHovering = ref(false);
const hoverProgress = ref(0);

function getImgPath(color: any) {
  return `/sneakers/${props.productId}-${color.folder_name}/0.jpg`;
}

function handleHover(event: MouseEvent) {
  if (!containerRef.value || props.colors.length <= 1) return;
  const rect = containerRef.value.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const progress = x / rect.width;
  hoverProgress.value = progress;
  const colorIndex = Math.floor(progress * props.colors.length);
  const validIndex = Math.max(0, Math.min(colorIndex, props.colors.length - 1));
  if (validIndex !== props.currentIndex) {
    emit('colorChange', validIndex);
  }
}
function handleHoverStart() {
  isHovering.value = true;
}
function handleHoverEnd() {
  isHovering.value = false;
  hoverProgress.value = 0;
}
</script>

<template>
  <div ref="containerRef" class="color-switcher" @mousemove="handleHover" @mouseenter="handleHoverStart" @mouseleave="handleHoverEnd">
    <div class="images-container">
      <img v-for="(color, index) in colors" :key="color.id" :src="getImgPath(color)" class="color-image" :class="{ 'active': index === currentIndex, 'inactive': index !== currentIndex}" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.color-switcher {
  width: 100%;
  border-radius: 1rem;
  aspect-ratio: 4 / 3;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  background: var(--sub-bg);

  .images-container {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .color-image {
    width: 100%;
    object-fit: cover;
    position: absolute;
    bottom: 0;
    left: 0;
    transition: opacity 0.3s ease;
    
    &.active {
      opacity: 1;
    }
    
    &.inactive {
      opacity: 0;
    }
  }
}
</style>