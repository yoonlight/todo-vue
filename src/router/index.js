import Vue from "vue";
import VueRouter from "vue-router";
import Main from "../components/Main";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: Main,
    children: [
      {
        path: "/hello",
        component: () => import("../components/HelloWorld")
      },
      {
        path: "/",
        component: () => import("../views/Todo")
      }
    ]
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
