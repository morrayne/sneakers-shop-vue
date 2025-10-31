<script setup lang="ts"></script>

<template>
  <div class="card">
    <div class="main-img-holder"></div>
    <div class="main-name"></div>
    <div class="main-subname"></div>
    <div class="tags">
      <div class="tag" v-for="value in 3" :key="value"></div>
    </div>
    <div class="btn"></div>
  </div>
</template>

<style scoped lang="scss">
.card {
  background: var(--extra-bg);
  padding: 1rem;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .main-img-holder {
    width: 100%;
    aspect-ratio: 4 / 3;
    background: var(--main-bg);
    border-radius: 0.5rem;
  }

  .main-name {
    width: 80%;
    height: calc(1.5 * 0.8rem);
    background: var(--main-bg);
    border-radius: 0.5rem;
  }

  .main-subname {
    width: 50%;
    height: calc(1.5 * 0.6rem);
    background: var(--main-bg);
    border-radius: 0.5rem;
  }

  .tags {
    width: 80%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;

    .tag {
      width: 100%;
      height: calc(1.5 * 1rem);
      background: var(--main-bg);
      border-radius: 0.5rem;
    }
  }

  .btn {
    width: 100%;
    height: 2rem;
    background: var(--main-bg);
    border-radius: 0.5rem;
  }
}
</style>
