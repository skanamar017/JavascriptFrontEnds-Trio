import { defineStore } from 'pinia'
import ApiService from '@/services/api'

export const useTrainersStore = defineStore('trainers', {
  state: () => ({
    trainers: [],
    loading: false,
    error: null
  }),

  actions: {
    // Fetch all trainers
    async fetchTrainers() {
      this.loading = true
      this.error = null
      
      try {
        const response = await ApiService.getAllTrainers()
        this.trainers = response
      } catch (error) {
        this.error = error.message || 'Failed to fetch trainers'
        console.error('Error fetching trainers:', error)
      } finally {
        this.loading = false
      }
    },

    // Get single trainer
    async getTrainer(id) {
      try {
        return await ApiService.getTrainer(id)
      } catch (error) {
        this.error = error.message || 'Failed to fetch trainer'
        console.error('Error fetching trainer:', error)
        throw error
      }
    },

    // Create new trainer
    async createTrainer(trainerData) {
      try {
        const newTrainer = await ApiService.createTrainer(trainerData)
        this.trainers.push(newTrainer)
        return newTrainer
      } catch (error) {
        this.error = error.message || 'Failed to create trainer'
        console.error('Error creating trainer:', error)
        throw error
      }
    },

    // Update trainer
    async updateTrainer(id, trainerData) {
      try {
        const updatedTrainer = await ApiService.updateTrainer(id, trainerData)
        const index = this.trainers.findIndex(trainer => trainer.id === id)
        if (index !== -1) {
          this.trainers[index] = updatedTrainer
        }
        return updatedTrainer
      } catch (error) {
        this.error = error.message || 'Failed to update trainer'
        console.error('Error updating trainer:', error)
        throw error
      }
    },

    // Delete trainer
    async deleteTrainer(id) {
      try {
        await ApiService.deleteTrainer(id)
        this.trainers = this.trainers.filter(trainer => trainer.id !== id)
      } catch (error) {
        this.error = error.message || 'Failed to delete trainer'
        console.error('Error deleting trainer:', error)
        throw error
      }
    },

    // Clear error
    clearError() {
      this.error = null
    }
  }
})