import { createRouter, createWebHistory } from 'vue-router'
import HI from '../components/TaskList.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HI
    }
  ]
})

export default router
