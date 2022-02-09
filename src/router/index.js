import Vue from "vue";
import Router from "vue-router";

import dashboard from "./dashboard";
import news from "./news";
import publish from "./publish";

import file from "./file";
import audit from "./audit";
import leave from "./leave"

// Containers
const TheContainer = () => import("@/containers/TheContainer");
const TheFullPageContainer = () => import("@/containers/TheFullPageContainer");

Vue.use(Router);

const router = new Router({
  mode: "hash", // https://router.vuejs.org/api/#mode
  linkActiveClass: "open active",
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: "/",
      redirect: "/login",
      name: "FullPage",
      component: {
        render(c) {
          return c("router-view");
        },
      },
      children: [
        {
          path: "login",
          name: "Login",
          component: () => import("@/views/pages/Login.vue"),
        },
        {
          path: "404",
          name: "404",
          component: () => import("@/views/pages/Page404.vue"),
        },
        {
          path: "500",
          name: "500",
          component: () => import("@/views/pages/Page500.vue"),
        },
      ],
    },
    {
      path: "",
      name: "Home",
      component: TheContainer,
      children: [...dashboard, ...news, ...file, ...audit, ...leave],
    },
    {
      path: "",
      name: "Publish",
      component: TheFullPageContainer,
      children: [...publish],
    },
    {
      path: "*",
      name: "Error",
      redirect: "/404",
    },
  ],
});

router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem("rtarfUser"));

  if (to.name === "Read News") {
    return next();
  } else if (!user && to.name != "Login") {
    return next({ name: "Login" });
  } else if (user && to.name == "Login") {
    return next({ name: "Dashboard" });
  }
  return next();
});

export default router;
