<script setup lang="ts">
// props
const props = defineProps<{
  name: string;
  val: string;
  display_color: boolean;
  color: string;
  active: boolean;
  direction: string | boolean;
}>();

// emits
const emit = defineEmits<{ wasClicked: [value: string] }>();
function handleClick() { emit('wasClicked', props.val) }
</script>

<template>
  <div :class="props.active ? 'sidebar-item active' : 'sidebar-item'" @click="handleClick">
    <div class="text">{{ props.name }}</div>
    <div class="color" v-if="props.display_color" :style="{ background: `${props.color}` }"></div>
    <div class="box" v-if="props.direction !== false">
      {{ props.direction }}
    </div>
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

  .box {
    font-size: 0.8rem;
    padding: 0 0.5rem;
    background: var(--bg-d);
    border-radius: 0.25rem;
  }

  .color {
    height: 0.75rem;
    margin-left: auto;
    aspect-ratio: 1 / 1;
    border-radius: 0.25rem;
    cursor: pointer;
  }
}

.active {
  background: var(--bg-c);
}
</style>
