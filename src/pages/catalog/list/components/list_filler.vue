<script setup lang="ts"></script>

<template>
  <div class="item">
    <div class="img"></div>
    <div class="name"></div>
    <div class="wrapper">
      <div class="sub" v-for="value in 3" :key="value"></div>
    </div>
    <div class="btn"></div>
  </div>
</template>

<style scoped lang="scss">
.item {
  width: 100%;
  padding: 1rem;
  aspect-ratio: 5 / 6;
  background: var(--extra-bg);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .img {
    width: 100%;
    aspect-ratio: 6 / 5;
    background: var(--sub-bg);
  }

  .name {
    width: 80%;
    height: 3rem;
    background: var(--sub-bg);
  }

  .wrapper {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;

    .sub {
      height: 2rem;
      background: var(--sub-bg);
    }
  }

  .btn {
     width: 100%;
    height: 3rem;
    background: var(--sub-bg);
  }
}
</style>
