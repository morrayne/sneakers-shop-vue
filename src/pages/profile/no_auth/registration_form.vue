<script setup lang="ts">
// vue
import { reactive, ref } from "vue"

// actions
import { loginUser, registerUser, syncPiniaAndSupabase } from "../../../helper/actions";
import { useGlobalState } from "../../../helper/pinia";
const global = useGlobalState();

import { supabase } from "../../../helper/imp/supabase";

// vars
const mode = ref<"login" | "register">("login")
const data = reactive({
  email: "",
  password: "",
  name: "",
  icon: 1,
})

// регистрация
async function handleSubmit(e: Event) {
  e.preventDefault()
  try {
    if (mode.value === "register") {
      const savedFavourite = global.user?.favourite || [];
      const savedBasket = global.user?.basket || [];
      
      console.log("🔍 [1] Данные ДО регистрации:", {
        favourite: savedFavourite,
        basket: savedBasket,
        globalUser: global.user
      });
      
      const userId = await registerUser({ 
        email: data.email, 
        password: data.password, 
        name: data.name, 
        icon: data.icon - 1 
      });
      
      console.log("🔍 [2] После registerUser, userId:", userId);
      console.log("🔍 [3] Global.user после регистрации:", global.user);
      
      if (savedFavourite.length > 0 || savedBasket.length > 0) {
        console.log("🔍 [4] Начинаем обновление...");
        
        const updates: any = {};
        if (savedFavourite.length > 0) updates.favourite = savedFavourite;
        if (savedBasket.length > 0) updates.basket = savedBasket;
        
        console.log("🔍 [5] Updates:", updates);
        
        const { data: updateResult, error } = await supabase
          .from("profiles")
          .update(updates)
          .eq("id", userId)
          .select();
          
        console.log("🔍 [6] Результат обновления:", { updateResult, error });
        
        if (error) {
          console.error("❌ Ошибка обновления профиля:", error);
        } else {
          console.log("✅ Данные успешно обновлены");
          // Принудительно перезагружаем сессию
          await supabase.auth.refreshSession();
          // И пересинхронизируем
          await syncPiniaAndSupabase(userId);
        }
      }
      
    } else {
      await loginUser(data.email, data.password);
    }
  } catch (err: any) {
    console.error("❌ Ошибка:", err.message);
  }
}

// режим регистрации или авторизации
function toggleMode() { mode.value = mode.value === "login" ? "register" : "login" }
</script>

<template>
  <form @submit="handleSubmit">
    <input type="email" v-model="data.email" placeholder="example@mail.com" required />
    <input type="password" v-model="data.password" placeholder="******" required />
    <input v-if="mode === 'register'" type="text" v-model="data.name" placeholder="How should we call you?" required />
    <div v-if="mode === 'register'" class="avatar-grid">
      <div v-for="index in 20" :key="index" :class="['avatar-option', { active: data.icon === index }]" @click="data.icon = index">
        <img :src="`/profile/${index - 1}.jpg`" />
      </div>
    </div>
    <button class="reg" type="submit">{{ mode === "login" ? "Login" : "Register" }}</button>
    <button type="button" @click="toggleMode">
      {{ mode === "login" ? "No account? Go to registration" : "Already have account? Go to login" }}
    </button>
  </form>
</template>

<style scoped lang="scss">
form {
  width: 24rem;
  padding: 1rem;
  background: var(--bg-c);
  outline: solid 2px var(--bg-d);
  border-radius: 1rem;
  display: flex;
  flex-direction: column;

  input {
    margin-bottom: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--bg-b);
    border-radius: 0.5rem;
  }

  .avatar-grid {
    margin-bottom: 0.5rem;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.2rem;

    .active {
      outline: solid 2px var(--text-a);
    }
  }

  .reg {
    margin-bottom: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    background: var(--text-a);
    color: var(--bg-a);
  }

  .switch {
    text-align: left;
    color: var(--text-c);
    font-size: 0.8rem;
    cursor: pointer;
  }
}
</style>
