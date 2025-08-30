import { defineStore } from 'pinia'
import ApiService from '@/services/api'

export const useTrainersStore = defineStore('trainers', {
  state: () => ({
    trainers: [],
    currentTrainer: null,
    trainerPokemon: [],
    loading: false,
    error: null
  }),

  getters: {
    getTrainerById: (state) => (id) => {
      return state.trainers.find(trainer => trainer.id === id)
    },
    
    hasTrainers: (state) => state.trainers.length > 0
  },

  actions: {
    // Fetch all trainers
    async fetchAllTrainers() {
      this.loading = true
      this.error = null
      
      try {
        this.trainers = await ApiService.getAllTrainers()
      } catch (error) {
        this.error = 'Failed to fetch trainers: ' + error.message
      } finally {
        this.loading = false
      }
    },

    // Fetch single trainer
    async fetchTrainer(id) {
      this.loading = true
      this.error = null
      
      try {
        this.currentTrainer = await ApiService.getTrainer(id)
      } catch (error) {
        this.error = 'Failed to fetch trainer: ' + error.message
      } finally {
        this.loading = false
      }
    },

    // Fetch trainer's Pokemon
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

    // Create new trainer
    async createTrainer(trainerData) {
      this.loading = true
      this.error = null
      
      try {
        const newTrainer = await ApiService.createTrainer(trainerData)
        this.trainers.push(newTrainer)
        return newTrainer
      } catch (error) {
        this.error = 'Failed to create trainer: ' + error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Delete trainer
    async deleteTrainer(id) {
      this.loading = true
      this.error = null
      
      try {
        await ApiService.deleteTrainer(id)
        // Remove trainer from local state
        this.trainers = this.trainers.filter(trainer => trainer.id !== id)
      } catch (error) {
        this.error = 'Failed to delete trainer: ' + error.message
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