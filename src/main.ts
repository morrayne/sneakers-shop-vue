import { createApp } from "vue";
import App from "./App.vue";

// router and pinia
import router from "./helper/router";
import { createPinia } from "pinia"; 

// css
import "./css/main.css";
import "./css/tailwind.css";

// bootstrap
async function bootstrap() {
  const app = createApp(App);
  const pinia = createPinia(); 
  app.use(pinia);       
  app.use(router);
  app.mount("#app");
}

bootstrap();
