<template>
  <div class="notify-root">
    <div v-for="n in notifications" :key="n.id" :class="['notify', n.type]">
      {{ n.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useGlobalState } from '../../helper/pinia';
const global = useGlobalState();
const notifications = computed(() => global.notifications);
</script>

<style scoped lang="scss">
.notify-root {
  position: absolute;
  bottom: 1.5rem;
  left: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 9999;
}

.notify {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background: var(--text-a);
  color: var(--bg-a);
  box-shadow: 0 6px 18px rgba(0,0,0,0.12);
  min-width: 10rem;
}

.notify.info { border-top: 4px solid var(--accent-a); }
.notify.success { border-top: 4px solid #4CAF50; }
.notify.warn { border-top: 4px solid #FF9800; }
.notify.error { border-top: 4px solid #F44336; }
</style>
