import axios from 'axios';

// Base URL for your Flask backend
const BASE_URL = 'http://localhost:5001';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Trainer API calls
export const trainerAPI = {
  // Get all trainers
  getAllTrainers: async () => {
    const response = await api.get('/Trainers/');
    return response.data;
  },

  // Get specific trainer
  getTrainer: async (trainerId) => {
    const response = await api.get(`/Trainers/${trainerId}`);
    return response.data;
  },

  // Create new trainer
  createTrainer: async (trainerData) => {
    const response = await api.post('/Trainers/', trainerData);
    return response.data;
  },

  // Update trainer
  updateTrainer: async (trainerId, trainerData) => {
    const response = await api.put(`/Trainers/${trainerId}`, trainerData);
    return response.data;
  },

  // Delete trainer
  deleteTrainer: async (trainerId) => {
    const response = await api.delete(`/Trainers/${trainerId}`);
    return response.data;
  },
};

// Pokemon API calls
export const pokemonAPI = {
  // Get all Pokemon from database
  getAllPokemon: async (type = null) => {
    const url = type ? `/Pokemon/?type=${type}` : '/Pokemon/';
    const response = await api.get(url);
    return response.data;
  },
};

// Trainer Pokemon API calls
export const trainerPokemonAPI = {
  // Get trainer's Pokemon
  getTrainerPokemon: async (trainerId) => {
    const response = await api.get(`/Trainers/${trainerId}/TrainerPokemon/`);
    return response.data;
  },

  // Add Pokemon to trainer
  addPokemonToTrainer: async (trainerId, pokemonData) => {
    const response = await api.post(`/Trainers/${trainerId}/TrainerPokemon/`, pokemonData);
    return response.data;
  },

  // Get specific trainer Pokemon with stats
  getTrainerPokemonStats: async (trainerId, pokemonId) => {
    const response = await api.get(`/Trainers/${trainerId}/TrainerPokemon/${pokemonId}/stats`);
    return response.data;
  },

  // Update trainer Pokemon
  updateTrainerPokemon: async (trainerId, pokemonId, pokemonData) => {
    const response = await api.put(`/Trainers/${trainerId}/TrainerPokemon/${pokemonId}`, pokemonData);
    return response.data;
  },

  // Delete trainer Pokemon
  deleteTrainerPokemon: async (trainerId, pokemonId) => {
    const response = await api.delete(`/Trainers/${trainerId}/TrainerPokemon/${pokemonId}`);
    return response.data;
  },
};

export default api;