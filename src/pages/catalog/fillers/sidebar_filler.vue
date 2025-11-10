<script setup lang="ts"></script>

<template>
  <div class="fillerr">
    <div class="search"></div>
    <div class="item" v-for="value in 3" :key="value">
      <div class="big"></div>
      <div class="space" v-for="value in 3" :key="value"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.fillerr {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  .search {
    width: 100%;
    height: 3rem;
    background: var(--bg-c);
  }

  .item {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    .big {
      height: 2.5rem;
      background: var(--bg-c);
    }

    .space {
      height: 1.5rem;
      background: var(--bg-c);
    }
  }
}
</style>
