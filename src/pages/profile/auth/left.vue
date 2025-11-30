<script setup lang="ts">
// pinia & actions
import { logoutUser } from "../../../helper/actions"
import { useGlobalState } from "../../../helper/pinia"
const global = useGlobalState()
</script>

<template>
  <div class="prof" v-if="global.user">
    <div class="id">{{ global.user.name }}</div>
    <!-- <div v-if="global.user" class="id">{{ global.user.id }}</div> -->
    <img v-if="global.user" :src="`/profile/${global.user.icon}.jpg`" alt="user icon" />
    <button class="log-out i18n" @click="logoutUser" data-key="logout"></button>
  </div>
</template>

<style scoped lang="scss">
.prof {
  padding: 1rem;
  background: var(--bg-c);
  border: solid 1px var(--bg-d);
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  img {
    border-radius: 0.5rem;
  }

  .id {
    max-width: 100%;
    width: fit-content;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.8rem;
    background: var(--bg-d);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .log-out {
    width: 100%;
    padding: 0.5rem 0;
    border-radius: 0.5rem;
    background: var(--text-a);
    color: transparent;
    
    &.i18n[data-key="logout"]::after {
      content: var(--logout);
      color: var(--bg-a);
    }
  }
}
</style>
