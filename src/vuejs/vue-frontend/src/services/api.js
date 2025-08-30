const BASE_URL = 'http://127.0.0.1:5001'

class ApiService {
  // Helper method for making HTTP requests
  async request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Trainer API methods
  async getAllTrainers() {
    return this.request('/Trainers/')
  }

  async getTrainer(id) {
    return this.request(`/Trainers/${id}`)
  }

  async createTrainer(trainerData) {
    return this.request('/Trainers/', {
      method: 'POST',
      body: JSON.stringify(trainerData),
    })
  }

  async updateTrainer(id, trainerData) {
    return this.request(`/Trainers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(trainerData),
    })
  }

  async deleteTrainer(id) {
    return this.request(`/Trainers/${id}`, {
      method: 'DELETE',
    })
  }

  // Pokemon API methods
  async getTrainerPokemon(trainerId) {
    return this.request(`/Trainers/${trainerId}/TrainerPokemon/`)
  }

  async createTrainerPokemon(trainerId, pokemonData) {
    return this.request(`/Trainers/${trainerId}/TrainerPokemon/`, {
      method: 'POST',
      body: JSON.stringify(pokemonData),
    })
  }

  async getTrainerWithPokemon(trainerId) {
    return this.request(`/Trainers/${trainerId}/WithPokemon`)
  }
}

export default new ApiService()