import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import routes from "virtual:generated-pages";
import { createPinia } from "pinia";
import App from "./App.vue";
import Antd from 'ant-design-vue';

import 'ant-design-vue/dist/reset.css';
// import "@unocss/reset/tailwind.css";
import "./style.css";
import "uno.css";

const pinia = createPinia();
const app = createApp(App);
const router = createRouter({
  history: createWebHistory(),
  routes,
});
app.use(router);
app.use(pinia);
app.use(Antd);
app.mount("#app");
