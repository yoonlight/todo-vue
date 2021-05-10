import Vue from "vue";
import VueRouter from "vue-router";
import Main from "../components/Main";
// import store from '../store'

Vue.use(VueRouter);
// const requireAuth = () => (to, from, next) => {
//   if (store.getters.isAuthenticated) return next()
//   next('/auth')
// }
const routes = [
  {
    path: "/?",
    // beforeEnter: requireAuth(),
    component: Main,
    children: [
      {
        path: "/:theme?",
        props: route => ({ theme: route.params.theme || "All" }),
        component: () => import("../views/Todo/Todo")
      }
    ]
  },
  // {
  //   path: "/auth",
  //   component: () => import("../views/Login/LoginForm")
  // },
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

export default router;
