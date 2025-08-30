import { defineStore } from 'pinia'
import ApiService from '@/services/api'

export const usePokemonStore = defineStore('pokemon', {
  state: () => ({
    trainerPokemon: [],
    currentPokemon: null,
    loading: false,
    error: null
  }),

  getters: {
    getPokemonByTrainerId: (state) => (trainerId) => {
      return state.trainerPokemon.filter(pokemon => pokemon.trainer_id === trainerId)
    },
    
    hasPokemon: (state) => state.trainerPokemon.length > 0
  },

  actions: {
    // Fetch Pokemon for a specific trainer
    async fetchTrainerPokemon(trainerId) {
      this.loading = true
      this.error = null
      
      try {
        this.trainerPokemon = await ApiService.getTrainerPokemon(trainerId)
      } catch (error) {
        this.error = 'Failed to fetch Pokemon: ' + error.message
      } finally {
        this.loading = false
      }
    },

    // Create new Pokemon for trainer
    async createTrainerPokemon(trainerId, pokemonData) {
      this.loading = true
      this.error = null
      
      try {
        const newPokemon = await ApiService.createTrainerPokemon(trainerId, pokemonData)
        this.trainerPokemon.push(newPokemon)
        return newPokemon
      } catch (error) {
        this.error = 'Failed to add Pokemon: ' + error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Update Pokemon
    async updateTrainerPokemon(trainerId, pokemonId, pokemonData) {
      this.loading = true
      this.error = null
      
      try {
        const updatedPokemon = await ApiService.updateTrainerPokemon(trainerId, pokemonId, pokemonData)
        const index = this.trainerPokemon.findIndex(p => p.id === pokemonId)
        if (index !== -1) {
          this.trainerPokemon[index] = updatedPokemon
        }
        return updatedPokemon
      } catch (error) {
        this.error = 'Failed to update Pokemon: ' + error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Delete Pokemon
    async deleteTrainerPokemon(trainerId, pokemonId) {
      this.loading = true
      this.error = null
      
      try {
        await ApiService.deleteTrainerPokemon(trainerId, pokemonId)
        this.trainerPokemon = this.trainerPokemon.filter(p => p.id !== pokemonId)
      } catch (error) {
        this.error = 'Failed to delete Pokemon: ' + error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Clear error
    clearError() {
      this.error = null
    }
  }
})