import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory('/scrum-poker/'), 
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

export default router;