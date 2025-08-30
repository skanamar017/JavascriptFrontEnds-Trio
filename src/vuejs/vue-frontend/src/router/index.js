import { createRouter, createWebHistory } from 'vue-router'
import TrainersList from '@/views/TrainersList.vue'
import AddTrainer from '@/views/AddTrainer.vue'
import EditTrainer from '@/views/EditTrainer.vue'
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
      path: '/add-trainer',
      name: 'add-trainer',
      component: AddTrainer
    },
    {
      path: '/edit-trainer/:id',
      name: 'edit-trainer',
      component: EditTrainer
    },
    {
      path: '/trainer/:id/pokemon',
      name: 'trainer-pokemon',
      component: TrainerPokemon
    }
  ]
})

export default router
