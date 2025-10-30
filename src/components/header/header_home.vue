<script setup lang="ts"></script>

<template>
  <header class="header-home">
    <img src="../../../public/vite.svg" alt="logo" class="logo" />
    <div class="header-nav">
      <router-link to="/home">HOME</router-link>
      <router-link to="/catalog">CATALOG</router-link>
      <router-link to="/profile">PROFILE</router-link>
      <router-link to="/favourite">FAVOURITE</router-link>
      <router-link to="/basket">BASKET</router-link>
    </div>
    <div class="header-duo">
      <img src="../../../public/vite.svg" alt="settings" />
      <img src="../../../public/vite.svg" alt="profile" />
    </div>
  </header>
</template>

<style scoped lang="scss">
.header-home {
  width: 100%;
  height: 4rem;
  padding: 0 4rem;
  border-bottom: solid 0.125rem var(--sub-header-bg);
  display: flex;
  justify-content: space-between;
  position: relative;

  .logo {
    height: 100%;
    aspect-ratio: 1 / 1;
    padding: 0.5rem;
  }

  .header-nav {
    width: 100%;
    height: 100%;
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;

    * {
      height: 100%;
      padding: 0 2rem;
      display: flex;
      align-items: center;
      cursor: pointer;
    }

    *:hover,
    *:active,
    *:focus {
      background: var(--sub-header-bg);
    }
  }

  .header-duo {
    display: flex;
    gap: 2rem;

    * {
      padding: 0.5rem;
    }
  }
}
</style>
