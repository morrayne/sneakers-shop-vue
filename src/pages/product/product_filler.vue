<script setup lang="ts"></script>

<template>
  <div class="product-filler">
    <div class="left">
      <div class="links">
        <div class="link" v-for="value in 3" :key="value"></div>
      </div>
      <div class="top"></div>
      <div class="bottom">
        <div class="img" v-for="value in 4" :key="value"></div>
      </div>
    </div>
    <div class="right">
      <div class="name"></div>
      <div class="sub"></div>
      <div class="cost"></div>
      <div class="imgs">
        <div class="img" v-for="value in 3" :key="value"></div>
      </div>
      <div class="tags">
        <div class="tag" v-for="value in 9" :key="value"></div>
      </div>
      <div class="duo">
        <div class="big"></div>
        <div class="small"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.product-filler {
  height: calc(100% - 4rem);
  padding: 1rem;
  display: flex;
  justify-content: center;
  gap: 4rem;

  .left {
    width: 32rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .links {
      display: flex;
      gap: 1rem;

      .link {
        width: 5rem;
        height: 2rem;
        background: var(--extra-bg);
      }
    }

    .bottom {
      display: flex;
      gap: 1rem;

      * {
        width: 100%;
        aspect-ratio: 1 / 1;
        background: var(--extra-bg);
      }
    }

    .top {
      width: 100%;
      aspect-ratio: 1 / 1;
      background: var(--extra-bg);
    }
  }

  .right {
    padding: 3rem 0 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .name {
      width: 32rem;
      height: 3rem;
      background: var(--extra-bg);
    }

    .sub {
      width: 18rem;
      height: 2rem;
      background: var(--extra-bg);
    }

    .cost {
      width: 24rem;
      height: 4rem;
      background: var(--extra-bg);
    }

    .imgs {
      margin: 2rem 0 0;
      display: flex;
      gap: 1rem;

      .img {
        width: 6rem;
        aspect-ratio: 1 / 1;
        background: var(--extra-bg);
      }
    }

    .tags {
      width: fit-content;
      margin: 2rem 0 0;
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 0.5rem;

      .tag {
        width: 4rem;
        height: 1.5rem;
        background: var(--extra-bg);
      }
    }

    .duo {
      height: 4rem;
      margin: 2rem 0 0;
      display: flex;
      gap: 1rem;

      .big {
        flex: 1;
        height: 100%;
        background: var(--extra-bg);
      }

      .small {
        height: 100%;
        aspect-ratio: 1 / 1;
        background: var(--extra-bg);
      }
    }
  }
}
</style>
