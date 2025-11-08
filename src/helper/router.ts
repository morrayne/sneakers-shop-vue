import { createRouter, createWebHistory } from "vue-router";

// imports
import Home from "../pages/home/home_main.vue";
import Catalog from "../pages/catalog/catalog_main.vue";
import Profile from "../pages/profile/profile_main.vue";
import Product from "../pages/product/product_main.vue";

// pages
const routes = [
  { path: "/", redirect: "/home" },
  { path: "/home", component: Home },
  { path: "/catalog", component: Catalog },
  { path: "/profile", component: Profile },
  { 
    path: "/product/:id", 
    component: Product,
    props: true
  },
];

// router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;