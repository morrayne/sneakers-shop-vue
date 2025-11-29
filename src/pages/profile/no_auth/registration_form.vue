<script setup lang="ts">
// vue
import { reactive, ref } from "vue"

// actions & supabase
import { loginUser, registerUser, syncPiniaAndSupabase } from "../../../helper/actions";
import { useGlobalState } from "../../../helper/pinia";
const global = useGlobalState();
import { supabase } from "../../../helper/imp/supabase";

// vars
const mode = ref<"login" | "register">("login")
const data = reactive({ email: "", password: "", name: "", icon: 1 })
const errData = ref({ name: false, pass: false, reuse: false });

// получения локализованного текста из CSS переменных
const getLocalizedText = (key: string): string => {
  const value = getComputedStyle(document.documentElement).getPropertyValue(`--${key}`).trim();
  return value.replace(/^["']|["']$/g, '');
}

// режим регистрации или авторизации
function toggleMode() { mode.value = mode.value === "login" ? "register" : "login" }

// регистрация
async function handleSubmit(e: Event) {
  // проверка формата данных
  e.preventDefault();
  if (data.password.length < 6 && mode.value === "register") {
    errData.value.pass = true;
    setTimeout(() => {
      errData.value.pass = false;
    }, 3000);
    return
  }
  if (data.name.length < 3 && mode.value === "register") {
    errData.value.name = true;
    setTimeout(() => {
      errData.value.name = false;
    }, 3000);
    return
  }
  // сама регистрация
  try {
    if (mode.value === "register") {
      const savedFavourite = global.user?.favourite || [];
      const savedBasket = global.user?.basket || [];
      const userId = await registerUser({ email: data.email, password: data.password, name: data.name, icon: data.icon - 1 });
      if (savedFavourite.length > 0 || savedBasket.length > 0) {
        const updates: any = {};
        if (savedFavourite.length > 0) updates.favourite = savedFavourite;
        if (savedBasket.length > 0) updates.basket = savedBasket;
        const { data: updateResult, error } = await supabase.from("profiles").update(updates).eq("id", userId).select();
        if (error) {
          console.error("❌ Ошибка обновления профиля:", error);
        } else {
          await supabase.auth.refreshSession();
          await syncPiniaAndSupabase(userId);
        }
      }
    } else {
      await loginUser(data.email, data.password);
    }
  } catch (err: any) {
    if (err = "User already registered") {
      errData.value.reuse = true;
      setTimeout(() => {
        errData.value.reuse = false;
      }, 3000);
    }
  }
}
</script>

<template>
  <form @submit="handleSubmit">
    <input type="email" v-model="data.email" placeholder="example@mail.com" required />
    <input type="password" v-model="data.password" placeholder="******" required />
    <input v-if="mode === 'register'" type="text" v-model="data.name" :placeholder="getLocalizedText('placeholderReg')" required />
    <div v-if="mode === 'register'" class="avatar-grid">
      <div v-for="index in 20" :key="index" :class="['avatar-option', { active: data.icon === index }]" @click="data.icon = index">
        <img :src="`/profile/${index - 1}.jpg`" />
      </div>
    </div>
    <button class="reg" type="submit">{{ mode === "login" ? getLocalizedText('login') : getLocalizedText('register') }}</button>
    <button type="button" class="switch" @click="toggleMode">
      {{ mode === "login" ? getLocalizedText('noAcc') : getLocalizedText('alreadyAcc') }}
    </button>
  </form>
  <div class="alert-log">
    <div v-if="errData.name" class="alert nameErr"></div>
    <div v-if="errData.pass" class="alert passErr"></div>
    <div v-if="errData.reuse" class="alert reuseErr"></div>
  </div>
</template>

<style scoped lang="scss">
.alert-log {
  position: absolute;
  bottom: 2rem;
  left: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .alert {
    border-top: solid 2px red;
    padding: 0.5rem 2rem;
    background: var(--text-a);
    color: var(--bg-a);
  }

  .nameErr::before {
    content: var(--nameErr);
  }

  .passErr::before {
    content: var(--passErr);
  }

  .reuseErr::before {
    content: var(--reuseErr);
  }
}

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



@media (max-width: 1024px) {
  form {
    width: 20rem;

    input {
      padding: 0.35rem 0.8rem;
    }

    .switch {
      font-size: 0.7rem;
    }
  }
}
</style>
