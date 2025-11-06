<script setup lang="ts">
// vue
import { reactive, ref } from "vue";

// supabase
import { supabase } from "../../../helper/supabase";

// pinia storage
import { useGlobalState } from "../../../helper/pinia";
const global = useGlobalState();

// types
import type { user_type } from '../../../helper/types';

// vars
const mode = ref<"login" | "register">("login");
const data = reactive({
  id: "",
  email: "",
  password: "",
  name: "",
  icon: 0,
});

// отправка формы
async function handleSubmit(event: Event) {
  event.preventDefault();
  if (mode.value === "register") {
    await tryRegister(data);
  } else {
    await tryAuth(data);
  }
  console.log("Данные формы:", data);
}

// переключение режимов регистрации и авторизации
function toggleMode() {
  mode.value = mode.value === "login" ? "register" : "login";
}

// регистрация
async function tryRegister(form_data: user_type) {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: form_data.email,
      password: form_data.password,
    });
    if (authError) throw authError;
    if (!authData.user) throw new Error("User not created. Check email confirmation.");
    const { data: profileData, error: profileError } = await supabase.from("profiles").insert([
        {
          id: authData.user.id,
          name: form_data.name,
          icon: form_data.icon,
        },
      ]);
    if (profileError) throw profileError;
    if (!profileData) throw new Error("Profile not created");
    Object.assign(global.user, profileData[0]);
    afterRegisterRedirect();
  } catch (err: any) {
    console.error("Ошибка регистрации:", err.message || err);
  }
}

// авторизация
async function tryAuth(form_data: user_type) {
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: form_data.email,
      password: form_data.password,
    });
    if (authError) throw authError;
    const { data: profileData, error: profileError } = await supabase.from("profiles").select("*").eq("id", authData.user.id).single();
    if (profileError) throw profileError;
    if (!profileData) throw new Error("Profile not found");
    Object.assign(global.user, profileData);
  } catch (err: any) {
    console.error("Ошибка авторизации:", err.message || err);
  }
}

// после регистрации
function afterRegisterRedirect() {
  mode.value = 'login';
  data.name = '';
}
</script>

<template>
  <form @submit="handleSubmit">
    <input type="email" v-model="data.email" placeholder="example@mail.com" required />
    <input type="password" v-model="data.password" placeholder="******" required />
    <input type="text" v-model="data.name" placeholder="how should we call you?" required v-if="mode === 'register'" />
    <div class="avatar-grid" v-if="mode === 'register'">
      <div v-for="(avatar, index) in 20" :key="index" :class="['avatar-option', { active: data.icon === index }]" @click="data.icon = index">
        <img :src="`/profile/${avatar}.jpg`" :alt="`Avatar ${index}`" />
      </div>
    </div>
    <button class="reg" type="submit">
      {{ mode === 'login' ? 'Login' : 'Register' }}
    </button>
    <button class="switch" type="button" @click="toggleMode">
      {{ mode === 'login' ? 'No account? Go to registration' : 'Already have account? Go to login' }}
    </button>
  </form>
</template>

<style scoped lang="scss">
form {
  width: 24rem;
  padding: 1rem;
  background: var(--extra-bg);
  border-radius: 1rem;
  display: flex;
  flex-direction: column;

  input {
    margin-bottom: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--sub-bg);
    border-radius: 0.5rem;
  }

  .avatar-grid {
    margin-bottom: 0.5rem;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.2rem;

    .active {
      outline: solid 2px var(--main-text);
    }
  }

  .reg {
    margin-bottom: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    background: var(--main-text);
    color: var(--main-bg);
  }

  .switch {
    text-align: left;
    color: var(--extra-text);
    font-size: 0.8rem;
    cursor: pointer;
  }
}
</style>
