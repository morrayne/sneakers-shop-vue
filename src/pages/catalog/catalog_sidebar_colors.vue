<script setup lang="ts">
import { computed, ref, watch } from "vue";

const props = defineProps<{
  sneakers: any[];
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const activeColor = ref(props.modelValue ?? "all");

// синхронизация с родителем
watch(() => props.modelValue, val => {
  if (val !== undefined) activeColor.value = val;
});

// вычисляем доступные цвета (folder_name)
const colorsAvailable = computed(() => {
  const colorSet = new Set<string>();
  props.sneakers.forEach(sneaker => {
    if (Array.isArray(sneaker.colors)) {
      sneaker.colors.forEach((c: any) => {
        if (c.folder_name) colorSet.add(c.folder_name);
      });
    }
  });
  return ["all", ...Array.from(colorSet)];
});

// клик по цвету
function selectColor(color: string) {
  activeColor.value = color;
  emit("update:modelValue", color);
}
</script>

<template>
  <div class="sidebar-colors">
    <div class="name">Color</div>
    <div v-for="color in colorsAvailable" :key="color" class="color-item" :class="{ active: activeColor === color }" @click="selectColor(color)">
      <div class="checkbox"></div>
      <div class="label">{{ color }}</div>
      <div class="color-box" :style="{ background: color === 'all' ? 'var(--sub-bg)' : color }"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.sidebar-colors {
  display: flex;
  flex-direction: column;
  margin-top: 1rem;

  .name {
    font-size: 1.2rem;
  }

  .color-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    cursor: pointer;
    border-radius: 0.25rem;
    padding: 0.25rem 0.5rem;
    color: var(--sub-text);

    .checkbox {
      width: 1rem;
      height: 1rem;
      border-radius: 0.25rem;
      background: var(--extra-bg);
      filter: brightness(0.9);
      flex-shrink: 0;
    }

    .label {
      font-size: 0.9rem;
      flex-grow: 1;
    }

    .color-box {
      width: 1rem;
      height: 1rem;
      border-radius: 0.25rem;
      flex-shrink: 0;
    }
  }

  .active .checkbox {
    filter: brightness(0.6);
    background: var(--extra-bg);
  }
}
</style>
