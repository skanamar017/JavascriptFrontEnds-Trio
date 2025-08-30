import { createRouter, createWebHistory } from 'vue-router'
import TrainersList from '@/views/TrainersList.vue'
import AddTrainer from '@/views/AddTrainer.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: TrainersList
    },
    {
      path: '/add-trainer',
      name: 'add-trainer',
      component: AddTrainer
    }
  ]
})

export default router
