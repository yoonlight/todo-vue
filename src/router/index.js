import Vue from "vue";
import VueRouter from "vue-router";
import Main from "../components/Main";
import store from "../store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: Main,
    children: [
      {
        name: "Home",
        path: "/:project/:theme",
        component: () => import("../views/Todo/Todo")
      }
    ]
  },
  {
    path: "/auth",
    name: "Login",
    component: () => import("../views/Login/LoginForm")
  },
  {
    path: "/register",
    component: () => import("../views/Login/SignUp")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters.isAuthenticated;
  if (isAuthenticated) {
    next();
    return;
  } else if (to.name !== "Login") {
    next({ name: "Login" });
  }
  next();
});

export default router;
