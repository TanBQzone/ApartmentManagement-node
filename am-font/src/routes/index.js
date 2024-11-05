import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/Home.vue'),
    children: [
      {
        path: 'account',
        name: 'account',
        component: () => import('@/views/account/account.vue')
      },
      {
        path: 'resident',
        name: 'resident',
        component: () => import('@/views/account/resident.vue')
      },
      {
        path: 'apartment',
        name: 'apartment',
        component: () => import('@/views/apartment/apartment.vue')
      },
      {
        path: 'room',
        name: 'room',
        component: () => import('@/views/apartment/room.vue')
      },
      {
        path: 'income',
        name: 'income',
        component: () => import('@/views/payment/Income.vue')
      },
      {
        path: 'payment',
        name: 'payment',
        component: () => import('@/views/payment/payment.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 拦截器，如果没有登录，自动跳转到登录页面，在页面的一开始
router.beforeEach((to, from, next) => {
  // console.log(to, from);
  
  const token = localStorage.getItem('AM-ISLOGIN');
  const requiresAuth = to.path !== '/login'; // 检查是否需要登录

  if (requiresAuth && !token) {
    next({ path: '/login' });
  } else {
    next();
  }
})

export default router;
