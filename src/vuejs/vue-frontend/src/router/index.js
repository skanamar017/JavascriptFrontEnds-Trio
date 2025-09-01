import { createRouter, createWebHistory } from 'vue-router'
import TrainersList from '@/views/TrainersList.vue'
import TrainerDetail from '@/views/TrainerDetail.vue'
import TrainerPokemonList from '@/views/TrainerPokemonList.vue'
import PokemonDetail from '@/views/PokemonDetail.vue'
import AddTrainer from '@/views/AddTrainer.vue'
import AddPokemon from '@/views/AddPokemon.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Master List - All Trainers
    {
      path: '/',
      name: 'TrainersList',
      component: TrainersList
    },
    // Add Trainer
    {
      path: '/trainers/add',
      name: 'AddTrainer',
      component: AddTrainer
    },
    // Master Detail - Single Trainer
    {
      path: '/trainers/:id',
      name: 'TrainerDetail',
      component: TrainerDetail
    },
    // Detail List - Trainer's Pokemon
    {
      path: '/trainers/:id/pokemon',
      name: 'TrainerPokemonList',
      component: TrainerPokemonList
    },
    // Add Pokemon to Trainer
    {
      path: '/trainers/:id/pokemon/add',
      name: 'AddPokemon',
      component: AddPokemon
    },
    // Detail Detail - Single Pokemon
    {
      path: '/trainers/:id/pokemon/:pokemonId',
      name: 'PokemonDetail',
      component: PokemonDetail
    }
  ]
})

export default router
