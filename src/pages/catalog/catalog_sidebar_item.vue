<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  data: { name: string; vals: string[] };
  modelValue?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const active = ref<string>(props.modelValue ?? ""); // дефолт вместо undefined

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== undefined) active.value = newVal;
  }
);

function handleClick(value: string) {
  active.value = value;
  emit("update:modelValue", value);
}
</script>

<template>
  <div class="item">
    <div class="name">{{ props.data.name }}</div>
    <div
      v-for="value in props.data.vals"
      :key="value"
      class="val"
      :class="{ active: active === value }"
      @click="handleClick(value)"
    >
      <div class="box"></div>
      <div class="option">{{ value }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: 1rem;

  .name {
    font-size: 1.2rem;
  }

  .val {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 0.9rem;
    cursor: pointer;
    border-radius: 0.25rem;
    padding: 0 0.5rem;
    color: var(--sub-text);

    .box {
      width: 1rem;
      height: 1rem;
      border-radius: 0.25rem;
      background: var(--extra-bg);
      filter: brightness(0.9);
    }
  }

  .active {
    .box {
      filter: brightness(0.6);
      background: var(--extra-bg);
    }
  }
}
</style>
