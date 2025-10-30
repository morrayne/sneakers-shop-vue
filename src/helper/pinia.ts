import { createPinia } from "pinia";
export const store = createPinia();

import { defineStore } from "pinia";
export const useProductsStore = defineStore("products", {
  state: () => ({
    products: [] as any[],
    loading: false,
  }),
  actions: {
    async fetchProducts() {
      this.loading = true;
      // Здесь потом будет запрос к Supabase
      setTimeout(() => {
        this.products = [
          { id: 1, name: "Nike Air Max", price: 15000 },
          { id: 2, name: "Adidas Samba", price: 12000 },
        ];
        this.loading = false;
      }, 800);
    },
  },
});
