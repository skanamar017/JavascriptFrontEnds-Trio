import { defineStore } from 'pinia'
import ApiService from '@/services/api'

export const usePokemonStore = defineStore('pokemon', {
  state: () => ({
    allPokemon: [],
    trainerPokemon: [],
    loading: false,
    error: null
  }),

  actions: {
    // Fetch all Pokemon for selection
    async fetchAllPokemon() {
      this.loading = true
      this.error = null
      
      try {
        console.log('Fetching all Pokemon...')
        const response = await ApiService.getAllPokemon()
        console.log('Received Pokemon data:', response)
        
        if (Array.isArray(response)) {
          this.allPokemon = response
          console.log('Set allPokemon to:', this.allPokemon.length, 'Pokemon')
        } else {
          console.error('Expected array but got:', typeof response, response)
          this.error = 'Invalid Pokemon data received'
          this.allPokemon = []
        }
      } catch (error) {
        this.error = error.message || 'Failed to fetch Pokemon'
        this.allPokemon = []
        console.error('Error fetching Pokemon:', error)
      } finally {
        this.loading = false
      }
    },

    // Fetch trainer's Pokemon
    async fetchTrainerPokemon(trainerId) {
      this.loading = true
      this.error = null
      
      try {
        const response = await ApiService.getTrainerPokemon(trainerId)
        this.trainerPokemon = response
      } catch (error) {
        this.error = error.message || 'Failed to fetch trainer Pokemon'
        console.error('Error fetching trainer Pokemon:', error)
      } finally {
        this.loading = false
      }
    },

    // Add Pokemon to trainer
    async createTrainerPokemon(trainerId, pokemonData) {
      try {
        const newPokemon = await ApiService.createTrainerPokemon(trainerId, pokemonData)
        this.trainerPokemon.push(newPokemon)
        return newPokemon
      } catch (error) {
        this.error = error.message || 'Failed to add Pokemon'
        console.error('Error adding Pokemon:', error)
        throw error
      }
    },

    // Update trainer Pokemon
    async updateTrainerPokemon(trainerId, pokemonId, pokemonData) {
      try {
        const updatedPokemon = await ApiService.updateTrainerPokemon(trainerId, pokemonId, pokemonData)
        const index = this.trainerPokemon.findIndex(p => p.id === pokemonId)
        if (index !== -1) {
          this.trainerPokemon[index] = updatedPokemon
        }
        return updatedPokemon
      } catch (error) {
        this.error = error.message || 'Failed to update Pokemon'
        console.error('Error updating Pokemon:', error)
        throw error
      }
    },

    // Delete trainer Pokemon
    async deleteTrainerPokemon(trainerId, pokemonId) {
      try {
        await ApiService.deleteTrainerPokemon(trainerId, pokemonId)
        this.trainerPokemon = this.trainerPokemon.filter(p => p.id !== pokemonId)
      } catch (error) {
        this.error = error.message || 'Failed to delete Pokemon'
        console.error('Error deleting Pokemon:', error)
        throw error
      }
    },

    // Clear error
    clearError() {
      this.error = null
    }
  }
})