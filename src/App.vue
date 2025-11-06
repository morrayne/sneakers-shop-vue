<script setup lang="ts">
// imports
import { onMounted } from "vue";
import { useGlobalState } from "./helper/pinia";
import { supabase } from "./helper/supabase";

// vars
const global = useGlobalState();

// сохранение сессии при переходе по ссылкам или тп
onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user) {
    const { data: profileData } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
    if (profileData) Object.assign(global.user, profileData);
  }
});
</script>

<template>
  <router-view />
</template>
