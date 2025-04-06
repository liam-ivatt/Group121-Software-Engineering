import { createRouter, createWebHistory } from 'vue-router'
import WelcomeView from '../views/WelcomeView.vue'
import HomeView from '../views/HomeView.vue'

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
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
