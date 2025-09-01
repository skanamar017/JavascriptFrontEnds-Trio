import { createRouter, createWebHistory } from 'vue-router'
import TrainersList from '@/views/TrainersList.vue'
import TrainerPokemon from '@/views/TrainerPokemon.vue'
import AddPokemon from '@/views/AddPokemon.vue'
import EditPokemon from '@/views/EditPokemon.vue'
import EditTrainer from '@/views/EditTrainer.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: TrainersList
    },
    {
      path: '/trainers/:id/edit',
      name: 'edit-trainer',
      component: EditTrainer
    },
    {
      path: '/trainers/:id/pokemon',
      name: 'trainer-pokemon',
      component: TrainerPokemon
    },
    {
      path: '/trainers/:trainerId/pokemon/add',
      name: 'add-pokemon',
      component: AddPokemon
    },
    {
      path: '/trainers/:trainerId/pokemon/:pokemonId/edit',
      name: 'edit-pokemon',
      component: EditPokemon
    }
  ]
})

export default router
