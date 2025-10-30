<script setup lang="ts">
import header_main from "../../components/header/header_main.vue";
</script>

<template>
  <div class="catalog">
    <div class="wrapper">
      <div class="content">
        <header_main />
        <main>
          <div class="left"></div>
          <div class="right">
            <div class="item"></div>
            <div class="item"></div>
            <div class="item"></div>
            <div class="item"></div>
            <div class="item"></div>
            <div class="item"></div>
            <div class="item"></div>
            <div class="item"></div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.catalog {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--main-bg);

  .wrapper {
    max-width: 2160px;
    max-height: 1080px;
    width: 100%;
    height: 100%;
    padding: 1rem;
    background: var(--main-bg);

    .content {
      width: 100%;
      height: 100%;
      position: relative;
      background: var(--sub-bg);
      border-radius: 1rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      main {
        height: calc(100% - 4rem);
        display: flex;

        .left {
          width: 18rem;
          height: 100%;
          border-right: solid 0.125rem var(--extra-bg);
        }

        .right {
          width: calc(100% - 18rem);
          height: 100%;
          padding: 1rem;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1rem;
          overflow-y: scroll;

          .item {
            width: 100%;
            height: 40rem;
            background: var(--extra-bg);
          }
        } ::-webkit-scrollbar {
          display: none;
        }
      }
    }
  }
}
</style>
