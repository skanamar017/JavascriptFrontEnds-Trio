const BASE_URL = 'http://localhost:5001'

class ApiService {
  // Make a request with error handling using fetch
  static async request(method, endpoint, data = null) {
    const url = `${BASE_URL}${endpoint}`
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    }

    if (data) {
      options.body = JSON.stringify(data)
    }

    try {
      console.log(`Making ${method} request to:`, url)
      const response = await fetch(url, options)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      console.log('API response received:', result)
      return result
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Trainer methods
  static async getAllTrainers() {
    return this.request('GET', '/Trainers/')
  }

  static async getTrainer(id) {
    return this.request('GET', `/Trainers/${id}`)
  }

  static async createTrainer(trainerData) {
    return this.request('POST', '/Trainers/', trainerData)
  }

  static async updateTrainer(id, trainerData) {
    return this.request('PUT', `/Trainers/${id}`, trainerData)
  }

  static async deleteTrainer(id) {
    return this.request('DELETE', `/Trainers/${id}`)
  }

  // Pokemon methods
  static async getAllPokemon(type = null) {
    const endpoint = type ? `/Pokemon/?type=${type}` : '/Pokemon/'
    return this.request('GET', endpoint)
  }

  // Trainer Pokemon methods
  static async getTrainerPokemon(trainerId) {
    return this.request('GET', `/Trainers/${trainerId}/TrainerPokemon/`)
  }

  static async createTrainerPokemon(trainerId, pokemonData) {
    return this.request('POST', `/Trainers/${trainerId}/TrainerPokemon/`, pokemonData)
  }

  static async getTrainerPokemonStats(trainerId, pokemonId) {
    return this.request('GET', `/Trainers/${trainerId}/TrainerPokemon/${pokemonId}/stats`)
  }

  static async updateTrainerPokemon(trainerId, pokemonId, pokemonData) {
    return this.request('PUT', `/Trainers/${trainerId}/TrainerPokemon/${pokemonId}`, pokemonData)
  }

  static async deleteTrainerPokemon(trainerId, pokemonId) {
    return this.request('DELETE', `/Trainers/${trainerId}/TrainerPokemon/${pokemonId}`)
  }
}

export default ApiService