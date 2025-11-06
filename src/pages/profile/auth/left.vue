<script setup lang="ts">
// vue
import { reactive, ref } from "vue";

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
    };
    console.log("Пользователь вышел из системы");
  }
}
</script>

<template>
  <button class="log-out" @click="logout">Log Out</button>
</template>

<style scoped lang="scss">
.log-out {
  width: 100%;
  padding: 0.5rem 0;
  background: var(--main-text);
  color: var(--main-bg);
}
</style>
