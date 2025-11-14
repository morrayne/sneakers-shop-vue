<script setup lang="ts">
// vue
import { onMounted } from "vue";

// supabase / pinia / actions
import { supabase } from "./helper/supabase";
import { syncPiniaAndSupabase } from "./helper/actions";
// import { useGlobalState } from "./helper/pinia";
// const global = useGlobalState();

onMounted(async () => {
  const { data: session } = await supabase.auth.getSession();
  const user = session?.session?.user;
  if (user) await syncPiniaAndSupabase(user.id);
});
</script>

<template>
  <router-view />
</template>
