<script setup lang="ts">
// props
const props = defineProps<{
  name: string;
  val: string;
  display_color: boolean;
  color: string;
  active: boolean;
}>();

// emits
const emit = defineEmits<{ wasClicked: [value: string] }>();
function handleClick() { emit('wasClicked', props.val) }
</script>

<template>
  <div :class="props.active ? 'sidebar-item active' : 'sidebar-item'" @click="handleClick">
    <!-- <div class="box"></div> -->
    <div class="text">{{ props.name }}</div>
    <div class="color" v-if="props.display_color" :style="{ background: `${props.color}` }"></div>
  </div>
</template>

<style scoped lang="scss">
.sidebar-item {
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;

  .box {
    height: 0.75rem;
    aspect-ratio: 1 / 1;
    border-radius: 0.25rem;
    background: var(--extra-text);
    opacity: 0.5;
    cursor: pointer;
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
  background: var(--extra-bg);
}
</style>
