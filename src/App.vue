<script setup lang="ts">
import { onMounted } from "vue";
import { initAuth } from "./helper/actions";
onMounted(() => { initAuth() });
</script>

<template>
  <router-view />
</template>
