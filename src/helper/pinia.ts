import { defineStore } from "pinia";
import type { user_type } from "./types";

export const useGlobalState = defineStore("global", {
  state: () => ({
    user: null as user_type | null,
    notifications: [] as Array<{ id: number; message: string; type?: string }>,
  }),
  actions: {
    setUser(newUser: user_type | null) { this.user = { ...newUser } as user_type | null },
    clearUser() { this.user = null },
    updateUserField<K extends keyof user_type>(field: K, value: user_type[K]) { 
      if (!this.user) return;
      this.user[field] = value;
    },
    // Notifications
    pushNotification(message: string, type = 'info') {
      const id = Date.now() + Math.floor(Math.random() * 1000);
      this.notifications.push({ id, message, type });
      // auto-remove after 3.5s
      setTimeout(() => this.removeNotification(id), 3500);
      return id;
    },
    removeNotification(id: number) {
      const idx = this.notifications.findIndex(n => n.id === id);
      if (idx >= 0) this.notifications.splice(idx, 1);
    }
  },
});
