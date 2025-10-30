<script setup lang="ts">
import header_home from "../../components/header/header_home.vue";
</script>

<template>
  <div class="home">
    <div class="wrapper">
      <div class="content">
        <header_home />
        <div class="holder">
          <div class="h1-wrapper">
            <h1>NIKE</h1>
            <div class="sub-h1">
              <p>JUST</p>
              <p>DO</p>
              <p>IT</p>
            </div>
            <div class="sub-h2">
              Nike Air Max 95
            </div>
            <div class="extra-h2">
              <span>SNEAKERS SHOP LANDING</span>
              <p>CREATED BY LUNAE LUCENT</p>
            </div>
          </div>
        </div>
        <div class="holder">
          <img src="/public/home/sneaker.png" alt="main-img" />
        </div>
        <div class="bottom-wrapper">
          <div class="line"></div>
          <div class="item"></div>
          <div class="item"></div>
          <div class="item"></div>
          <div class="item"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.home {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--sub-header-bg);

  .wrapper {
    max-width: 2160px;
    max-height: 1080px;
    width: 100%;
    height: 100%;
    padding: 1rem;
    background: var(--sub-header-bg);

    .content {
      width: 100%;
      height: 100%;
      position: relative;
      background: var(--main-header-bg);
      border-radius: 1rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .holder {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;

      .h1-wrapper {
        position: relative;

        h1 {
          font-size: 24rem;
          color: var(--sub-header-bg);
          letter-spacing: 2rem;
        }

        .sub-h1 {
          position: absolute;
          top: 2rem;
          left: -6rem;

          p {
            font-weight: 700;
            font-size: 6rem;
            line-height: 1;
          }
        }

        .sub-h2 {
          font-weight: 700;
          color: var(--sub-header-text);
          font-size: 2rem;
          position: absolute;
          bottom: 5rem;
          left: -6rem;
        }

        .extra-h2 {
          display: flex;
          flex-direction: column;
          gap: 3rem;
          position: absolute;
          bottom: 15.5rem;
          right: -6rem;

          p {
            color: var(--main-header-text);
          }

          span {
            color: var(--sub-header-text);
          }
        }
      }

      img {
        scale: 1;
      }
    }

    .bottom-wrapper {
      height: 8rem;
      padding: 0 4rem 2rem;
      display: flex;
      align-items: end;
      gap: 2rem;

      .line {
        flex: 1;
        height: 0.25rem;
        background: var(--main-header-text);
      }

      .item {
        width: 12rem;
        height: 100%;
        background: var(--main-header-text);
      }
    }
  }
}
</style>
