import App from "./App.vue";
import { createApp } from "vue";
// CSS
import "./css/main.css";
import "./css/tailwind.css";
// ROUTER
import router from "./helper/router";

async function bootstrap() {
  // APP INIT
  const app = createApp(App);
  // ROUTER
  app.use(router);
  // CONFIG
  document.body.setAttribute("data-theme", "light");
  app.mount("#app");
}

bootstrap();
