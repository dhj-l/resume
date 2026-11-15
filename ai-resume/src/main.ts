import { createApp } from "vue";

import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import Antd from "ant-design-vue";

import "ant-design-vue/dist/reset.css";
import "./style.css";
import App from "./App.vue";
import { safeHtml } from "./directives/safeHtml";
import router from "./router";

dayjs.locale("zh-cn");
const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);
app.use(router);
app.use(Antd);

app.directive("safe-html", safeHtml);

app.mount("#app");
