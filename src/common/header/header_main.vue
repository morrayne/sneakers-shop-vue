<script setup lang="ts">
// pinia globals state
import { useGlobalState } from "../../helper/pinia";
const global = useGlobalState();
</script>

<template>
  <header class="header-home">
    <p class="logo">「快歩」</p>
    <div class="header-nav">
      <router-link to="/home">HOME</router-link>
      <router-link to="/catalog">CATALOG</router-link>
      <router-link to="/profile">PROFILE</router-link>
    </div>
    <div class="icon-wrapper" v-if="global.user.id !== 'filler'">
      <img :src="`../../../public/profile/${global.user.icon}.jpg`" alt="user-icon">
    </div>
  </header>
</template>

<style scoped lang="scss">
.header-home {
  width: 100%;
  height: 4rem;
  padding: 0 4rem;
  border-bottom: solid 0.125rem var(--extra-bg);
  display: flex;
  justify-content: space-between;
  position: relative;

  .logo {
    height: 100%;
    color: var(--main-text);
    font-size: 1.5rem;
    display: flex;
    align-items: center;
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
      color: var(--main-text);
      padding: 0 2rem;
      display: flex;
      align-items: center;
      cursor: pointer;
    }

    *:hover,
    *:active,
    *:focus {
      background: var(--extra-bg);
    }
  }

  .icon-wrapper {
    height: 100%;
    aspect-ratio: 1 / 1;
    padding: 0.5rem;
    position: relative;
    z-index: 10;
    cursor: pointer;

    img {
      border-radius: 50%;
    }
  }
}
</style>
