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
        component: () => import("../views/Todo/Todo")
      },
      {
        path: "/example",
        component: () => import("../views/Todo/TodoExample")
      }
    ]
  },
  {
    path: "/auth",
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
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ["/auth", "/register"];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem("user");

  if (authRequired && !loggedIn) {
    return next("/auth");
  }

  next();
});

export default router;
