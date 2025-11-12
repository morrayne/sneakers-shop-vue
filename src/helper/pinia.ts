// imports
import { defineStore } from "pinia";
import type { user_type, config_type } from "./types";

// значение заглушка для неавторизованных пользователей
const fillerUser: user_type = {
  id: "filler",
  email: "",
  password: "",
  name: "Guest",
  icon: 0,
  favourite: [],
  basket: [],
  history: [],
};

export const useGlobalState = defineStore("global", {
  state: () => ({
    user: { ...fillerUser } as user_type,
    config: {
      lang: "ru",
      theme: "light",
    } as config_type,
  }),

  actions: {
    // установка данных пользователя (например, после логина/регистрации)
    setUser(newUser: user_type) {
      this.user = { ...newUser };
    },
    // очистка данных при выходе из аккаунта
    clearUser() {
      this.user = { ...fillerUser };
    },
    // обновление отдельного поля пользователя (локально)
    updateUserField<K extends keyof user_type>(field: K, value: user_type[K]) {
      this.user[field] = value;
    },
  },
});
