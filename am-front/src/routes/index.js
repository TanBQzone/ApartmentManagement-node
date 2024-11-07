/*
 * @Author: 谭必清
 * @Date: 2024-11-06 23:56:35
 * @LastEditors: 谭必清
 * @LastEditTime: 2024-11-07 00:36:39
 * @FilePath: /ApartmentManagement-node/am-front/src/routes/index.js
 * Copyright (c) 2020 - 2024 by TanBQ., All Rights Reserved.
 */
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/home",
    name: "home",
    component: () => import("@/views/Home.vue"),
    children: [
      {
        path: "account",
        name: "account",
        component: () => import("@/views/account/account.vue"),
      },
      {
        path: "resident",
        name: "resident",
        component: () => import("@/views/account/resident.vue"),
      },
      {
        path: "apartment",
        name: "apartment",
        component: () => import("@/views/apartment/apartment.vue"),
      },
      {
        path: "room",
        name: "room",
        component: () => import("@/views/apartment/room.vue"),
      },
      {
        path: "income",
        name: "income",
        component: () => import("@/views/payment/Income.vue"),
      },
      {
        path: "payment",
        name: "payment",
        component: () => import("@/views/payment/payment.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/Login.vue"),
  },
  {
    path: "/403",
    component: () => import("@/views/error/403.vue"),
  },
  {
    path: "/404",
    component: () => import("@/views/error/404.vue"),
  },
  {
    path: "/500",
    component: () => import("@/views/error/500.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 拦截器，如果没有登录，自动跳转到登录页面，在页面的一开始
router.beforeEach((to, from, next) => {
  // console.log(to, from);

  const token = localStorage.getItem("AM-ISLOGIN");
  // const isAdmin = JSON.parse(localStorage.getItem("AM-Account")).isAdmin;
  const requiresAuth = to.path !== "/login"; // 检查是否需要登录
  const adminPage = ["/home/account", "/home/apartment", "/home/income"]; // 只能管理员查看的页面

  // if (adminPage.includes(to.path) && !isAdmin) {
  //   next({ path: '/403' });
  // }

  if (requiresAuth && !token) {
    next({ path: "/login" });
  } else {
    next();
  }
});

export default router;
