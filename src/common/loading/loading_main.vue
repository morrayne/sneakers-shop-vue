<script setup lang="ts"></script>

<template>
  <div class="loading-wrapper">
    <div class="spinner"></div>
    <p>Loading in progress</p>
  </div>
</template>

<style scoped lang="scss">
.loading-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  gap: 1rem;
  text-align: center;
}

.loading-wrapper p {
  font-size: 1rem;
  color: var(--text-a);
}

.spinner {
  width: 80px;
  height: 80px;
  border: 8px solid var(--text-a); 
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
