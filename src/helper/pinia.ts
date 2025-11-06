// импорт типов
import type { user_type, config_type } from "./types";

// импорт заглушек
const user_filler = {
  id: "filler",
  email: "filler",
  password: "filler",
  name: "filler",
  icon: 0,
};
const config_filler = {
  lang: "",
  theme: "",
};

// глобальные переменные
import { defineStore } from "pinia";
export const useGlobalState = defineStore("global", {
  state: () => ({
    user: user_filler as user_type,
    config: config_filler as config_type,
    loading: false as boolean,
  }),
});
