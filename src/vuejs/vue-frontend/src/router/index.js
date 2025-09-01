import { createRouter, createWebHistory } from 'vue-router'
import TrainersList from '@/views/TrainersList.vue'
import TrainerPokemon from '@/views/TrainerPokemon.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: TrainersList
    },
    {
      path: '/trainers/:id/pokemon',
      name: 'trainer-pokemon',
      component: TrainerPokemon
    }
  ]
})

export default router
