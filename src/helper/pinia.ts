import { defineStore } from "pinia";
import type { user_type } from "./types";

export const useGlobalState = defineStore("global", {
  state: () => ({ user: null as user_type | null }),
  actions: {
    setUser(newUser: user_type | null) { this.user = { ...newUser } as user_type | null },
    clearUser() { this.user = null },
    updateUserField<K extends keyof user_type>(field: K, value: user_type[K]) { 
      if (!this.user) return;
      this.user[field] = value;
    },
  },
});
