<script setup lang="ts">
// pinia
import { useGlobalState } from "../../helper/pinia";
const global = useGlobalState();
</script>

<template>
  <header class="header-home">
    <p class="logo">「快歩」</p>
    <div class="header-nav">
      <router-link to="/home"></router-link>
      <router-link to="/catalog"></router-link>
      <router-link to="/favourite"></router-link>
      <router-link to="/basket"></router-link>
      <router-link to="/settings"></router-link>
    </div>
    <router-link class="icon-wrapper" to="/profile">
      <img v-if="global.user && global.user.id !== 'Guest'" :src="`/profile/${global.user.icon}.jpg`" alt="user-icon" />
      <img v-else :src="`/profile/0.jpg`" alt="user-icon" />
    </router-link>
  </header>
</template>

<style scoped lang="scss">
.header-home {
  width: 100%;
  height: 4rem;
  padding: 0 4rem;
  border-bottom: solid 0.125rem var(--bg-c);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;

  .logo {
    color: var(--text-a);
    font-size: 1.5rem;
    z-index: 10;
  }

  .header-nav {
    width: 100%;
    min-height: 4rem;
    height: 100%;
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    justify-content: center;
    align-items: center;

    a {
      height: 100%;
      color: var(--main-header-text);
      padding: 0 2rem;
      display: flex;
      align-items: center;
      cursor: pointer;
      &[href="/home"]::after { content: var(--home) }
      &[href="/catalog"]::after { content: var(--catalog) }
      &[href="/favourite"]::after { content: var(--favourites) }
      &[href="/basket"]::after { content: var(--basket) }
      &[href="/settings"]::after { content: var(--settings) }
      &::after {
        color: var(--text-a);
        white-space: nowrap;
      }
    }

    *:hover, *:active, *:focus {
      background: var(--bg-c);
    }
  }

  .icon-wrapper {
    height: 3rem;
    aspect-ratio: 1 / 1;
    padding: 0.5rem;
    position: relative;
    z-index: 10;
    cursor: pointer;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
    }
  }
}

/* Планшеты */
@media (max-width: 1024px) {
  .header-home {
    height: 3.5rem;
    padding: 0 2rem;
    
    .logo {
      font-size: 1.3rem;
    }
    
    .header-nav a {
      min-height: 3.5rem;
      padding: 0 1.5rem;
      font-size: 0.9rem;
    }
    
    .icon-wrapper {
      height: 2.5rem;
      padding: 0.4rem;
    }
  }
}

/* Маленькие планшеты */
@media (max-width: 768px) {
  .header-home {
    height: 3rem;
    padding: 0 1.5rem;
    
    .logo {
      font-size: 1.1rem;
    }

    .header-nav {
      min-height: 3rem;
    }
    
    .header-nav a {
      padding: 0 1rem;
      font-size: 0.8rem;
    }
    
    .icon-wrapper {
      height: 2rem;
      padding: 0.3rem;
    }
  }
}

/* Большие телефоны */
@media (max-width: 640px) {
  .header-home {
    height: 2.5rem;
    padding: 0 1rem;
    
    .logo {
      font-size: 0.8rem;
    }

    .header-nav {
      min-height: 2.5rem;
    }
    
    .header-nav a {
      padding: 0 0.7rem;
      font-size: 0.7rem;
    }
    
    .icon-wrapper {
      height: 1.8rem;
      padding: 0.2rem;
    }
  }
}

/* Телефоны */
@media (max-width: 480px) {
  .header-home {
    height: 2rem;
    padding: 0 0.5rem;
    
    .logo {
      display: none;
    }

    .header-nav {
      min-height: 2rem;
    }
    
    .header-nav a {
      padding: 0 0.5rem;
      font-size: 0.6rem;
    }
    
    .icon-wrapper {
      height: 1.5rem;
      padding: 0.1rem;
    }
  }
}

/* Очень маленькие телефоны */
@media (max-width: 360px) {
  .header-home {
    .header-nav a {
      padding: 0 0.3rem;
      font-size: 0.55rem;
    }
    
    .logo {
      font-size: 0.8rem;
    }
  }
}

/* Дополнительно */
@media (max-width: 320px) {
  .header-home {
    .header-nav a {
      padding: 0 0.2rem;
      font-size: 0.5rem;
    }
  }
}
</style>
