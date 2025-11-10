<script setup lang="ts">
// supabase
import { supabase } from "../../../helper/supabase";

// pinia storage
import { useGlobalState } from "../../../helper/pinia";
const global = useGlobalState();

// выход из аккаунта
async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Ошибка при выходе:", error.message);
  } else {
    global.user = {
      id: "filler",
      email: "filler",
      password: "filler",
      name: "filler",
      icon: 0,
      favourite: [],
      basket: [],
      history: [],
    };
    console.log("Пользователь вышел из системы");
  }
}
</script>

<template>
  <div class="prof">
    <img :src="`/public/profile/${global.user.icon}.jpg`" alt="" />
    <button class="log-out" @click="logout">Log Out</button>
  </div>
</template>

<style scoped lang="scss">
.prof {
  padding: 1rem;
  background: var(--extra-bg);
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .log-out {
    width: 100%;
    padding: 0.5rem 0;
    background: var(--text-a);
    color: var(--bg-a);
  }
}
</style>
