import { createRouter, createWebHistory } from "vue-router";

// imports
import Basket from "../pages/basket/basket_main.vue";
import Catalog from "../pages/catalog/catalog_main.vue";
import Favourite from "../pages/favourite/favourite_main.vue";
import Home from "../pages/home/home_main.vue";
import Product from "../pages/product/product_main.vue";
import Profile from "../pages/profile/profile_main.vue";
import Settings from "../pages/settings/settings.vue";

// pages
const routes = [
  { path: "/", redirect: "/home" },
  { path: "/basket", component: Basket },
  { path: "/catalog", component: Catalog },
  { path: "/favourite", component: Favourite },
  { path: "/home", component: Home },
  { path: "/product/:id", component: Product, props: true },
  { path: "/profile", component: Profile },
  { path: "/settings", component: Settings },
];

// router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;