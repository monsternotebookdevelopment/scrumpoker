import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/HomeView.vue"),
    },
    {
      path: "/room/:roomId",
      name: "poker-room",
      component: () => import("../views/PokerRoomView.vue"),
    },
  ],
});

router.beforeEach((to, from, next) => {
  const requiresNickname = to.name === "poker-room";
  const hasNickname = !!localStorage.getItem("nickname");

  if (requiresNickname && !hasNickname) {
    next({ name: "home", query: { redirect: to.fullPath } });
  } else {
    next();
  }
});

export default router;
