<script setup lang="ts">
// props & types
const props = defineProps<sidebar_item>();
import type { sidebar_item } from '../../../helper/types';

// emits
const emit = defineEmits<{ wasClicked: [value: string] }>();
function handleClick() { emit('wasClicked', props.val) }
</script>

<template>
  <div :class="props.active ? 'sidebar-item active' : 'sidebar-item'" @click="handleClick">
    <div class="text">{{ props.name }}</div>
    <div class="color" v-if="props.display_color" :style="{ background: `${props.color}` }"></div>
    <div class="box" v-if="props.direction !== false"> {{ props.direction }} </div>
  </div>
</template>

<style scoped lang="scss">
.sidebar-item {
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;

  .text {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 1rem;
  }

  .box {
    font-size: 0.8rem;
    padding: 0 0.5rem;
    background: var(--bg-d);
    border-radius: 0.25rem;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .color {
    height: 0.75rem;
    margin-left: auto;
    aspect-ratio: 1 / 1;
    border-radius: 0.25rem;
    cursor: pointer;
    border: 1px solid var(--bg-b);
    flex-shrink: 0;
  }
}

.active {
  background: var(--bg-c);
}

/* Планшеты */
@media (max-width: 1024px) {
  .sidebar-item {
    padding: 0.2rem 0.4rem;
    gap: 0.8rem;
    
    .text {
      font-size: 0.95rem;
    }
    
    .box {
      font-size: 0.75rem;
      padding: 0 0.4rem;
    }
  }
}

/* Телефоны */
@media (max-width: 768px) {
  .sidebar-item {
    padding: 0.15rem 0.3rem;
    gap: 0.6rem;
    border-radius: 0.4rem;
    
    .text {
      font-size: 0.9rem;
    }
    
    .box {
      font-size: 0.7rem;
      padding: 0 0.3rem;
    }
  }
}

/* Маленькие телефоны */
@media (max-width: 480px) {
  .sidebar-item {
    padding: 0.1rem 0.25rem;
    gap: 0.5rem;
    
    .text {
      font-size: 0.85rem;
    }
    
    .box {
      font-size: 0.65rem;
      padding: 0 0.25rem;
    }
  }
}
</style>
