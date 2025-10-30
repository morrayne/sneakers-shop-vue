import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/home/home_main.vue";
import Catalog from "../pages/catalog/catalog_main.vue";

const routes = [
  { path: "/", redirect: "/home" },
  { path: "/home", component: Home },
  { path: "/catalog", component: Catalog },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
