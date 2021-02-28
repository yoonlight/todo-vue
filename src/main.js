import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import axios from "axios";
import VueAxios from "vue-axios";
import Toasted from "vue-toasted";
import VueCookies from "vue-cookies";

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);
Vue.use(Toasted);
Vue.use(VueCookies);

Vue.$cookies.config("7d");
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
