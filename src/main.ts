import { createApp } from "vue";
import App from "./App.vue";

// router & pinia
import router from "./helper/router";
import { createPinia } from "pinia"; 

// css
import "./css/main.css";
import "./css/tailwind.css";

// Загрузка конфига из localStorage
function loadConfig() {
  const htmlElement = document.documentElement;
  const lang = localStorage.getItem('lang');
  const theme = localStorage.getItem('theme');
  const homeTheme = localStorage.getItem('homeTheme');
  if (lang) htmlElement.setAttribute('lang', lang);
  if (theme) htmlElement.setAttribute('data-theme', theme);
  if (homeTheme) htmlElement.setAttribute('data-home-theme', homeTheme);
}

// bootstrap
async function bootstrap() {
  loadConfig();
  const app = createApp(App);
  const pinia = createPinia(); 
  app.use(pinia);       
  app.use(router);
  app.mount("#app");
}

bootstrap();
