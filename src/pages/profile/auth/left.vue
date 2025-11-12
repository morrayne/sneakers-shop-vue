<script setup lang="ts">
import { logoutUser } from "../../../helper/actions"
import { useGlobalState } from "../../../helper/pinia"

const global = useGlobalState()
</script>

<template>
  <div class="prof">
    <img :src="`/profile/${global.user.icon}.jpg`" alt="user icon" />
    <div class="id">{{ global.user.name || global.user.email }}</div>
    <button class="log-out" @click="logoutUser">Log Out</button>
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
    width: fit-content;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.8rem;
    background: var(--bg-d);
  }

  .log-out {
    width: 100%;
    padding: 0.5rem 0;
    border-radius: 0.5rem;
    background: var(--text-a);
    color: var(--bg-a);
  }
}
</style>
