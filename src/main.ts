import { createApp } from "vue";
import "./css/main.css";
import "./css/tailwind.css";
import App from "./App.vue";
import router from "./helper/router";

async function bootstrap() {
  // APP INIT
  const app = createApp(App);
  // ROUTER
  app.use(router);
  app.mount("#app");
}

bootstrap();
