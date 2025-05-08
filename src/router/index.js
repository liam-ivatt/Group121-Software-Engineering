import { createRouter, createWebHistory } from 'vue-router'
import WelcomeView from '../views/WelcomeView.vue'
import HomeView from '../views/HomeView.vue'
import GroupView from '@/views/GroupView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/welcome',
    name: 'welcome',
    component: WelcomeView
  },
  {
    path: '/group',
    name: 'group',
    component: GroupView,
    meta: {
      requiresAuth: true,
    }
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    try {
      const res = await fetch('http://localhost:5000/check-auth', {
        credentials: 'include'
      });

      if (res.ok) {
        next(); 
      } else {
        next('/welcome'); 
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      next('/welcome');
    }
  } else {
    next();
  }
});

export default router
