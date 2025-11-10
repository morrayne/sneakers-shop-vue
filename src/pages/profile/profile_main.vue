<script setup lang="ts">
// pinia
import { useGlobalState } from "../../helper/pinia";
const global = useGlobalState();

// components
import header_main from "../../common/header/header_main.vue";
import wrapper_main from "../../common/wrapper/wrapper_main.vue";
import registration_form from "./no_auth/registration_form.vue";
import left from "./auth/left.vue";
</script>

<template>
  <wrapper_main>
    <header_main />
    <main>
      <div class="left" v-if="global.user.id !== 'filler'">
        <left />
      </div>
      <div :class="global.user.id !== 'filler' ? 'chopped-right' : 'full-right'">
        <registration_form v-if="global.user.id === 'filler'" />
      </div>
    </main>
  </wrapper_main>
</template>

<style scoped lang="scss">
main {
  height: calc(100% - 4rem);
  display: flex;

  .left {
    width: 24rem;
    padding: 1rem;
    border-right: solid 0.125rem var(--bg-c);
  }

  .full-right {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .chopped-right {
    width: calc(100% - 24rem);
  }
}
</style>
