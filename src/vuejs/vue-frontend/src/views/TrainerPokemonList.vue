<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePokemonStore } from "@/stores/pokemon";
import { useTrainersStore } from "@/stores/trainers";

const route = useRoute();
const router = useRouter();
const pokemonStore = usePokemonStore();
const trainersStore = useTrainersStore();

const trainerId = parseInt(route.params.id);
const trainer = ref(null);
const pokemon = computed(() => pokemonStore.trainerPokemon);
const loading = computed(() => pokemonStore.loading);
const error = computed(() => pokemonStore.error);

onMounted(async () => {
  try {
    trainer.value = await trainersStore.getTrainer(trainerId);
    await pokemonStore.fetchTrainerPokemon(trainerId);
  } catch (err) {
    console.error("Failed to load data:", err);
  }
});

const viewPokemon = (pokemonData) => {
  router.push(`/trainers/${trainerId}/pokemon/${pokemonData.id}`);
};

const addPokemon = () => {
  router.push(`/trainers/${trainerId}/pokemon/add`);
};

const goBack = () => {
  router.push(`/trainers/${trainerId}`);
};

const goHome = () => {
  router.push("/");
};
</script>

<template>
  <div class="pokemon-list">
    <div class="header">
      <div class="breadcrumb">
        <button @click="goHome" class="btn btn-outline btn-small">← Trainers</button>
        <span class="separator">/</span>
        <button @click="goBack" class="btn btn-outline btn-small">
          {{ trainer?.name || "Trainer" }}
        </button>
        <span class="separator">/</span>
        <span class="current">Pokemon Team</span>
      </div>
      <button @click="addPokemon" class="btn btn-primary">+ Add Pokemon</button>
    </div>

    <h1 v-if="trainer">{{ trainer.name }}'s Pokemon Team</h1>
    <h1 v-else>Pokemon Team</h1>

    <div v-if="loading" class="loading">Loading Pokemon...</div>

    <div v-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="pokemonStore.clearError()" class="btn btn-outline">Clear Error</button>
    </div>

    <div v-if="!loading && !error" class="pokemon-section">
      <div v-if="pokemon.length === 0" class="empty">
        <p>This trainer has no Pokemon yet.</p>
        <button @click="addPokemon" class="btn btn-primary">Add First Pokemon</button>
      </div>

      <div v-else class="pokemon-grid">
        <div v-for="poke in pokemon" :key="poke.id" class="pokemon-card" @click="viewPokemon(poke)">
          <div class="pokemon-header">
            <h3>{{ poke.nickname || poke.pokemon_name }}</h3>
            <p v-if="poke.nickname" class="pokemon-species">({{ poke.pokemon_name }})</p>
          </div>

          <div class="pokemon-summary">
            <p><strong>Level:</strong> {{ poke.level }}</p>
            <p v-if="poke.type1">
              <strong>Type:</strong> {{ poke.type1
              }}<span v-if="poke.type2"> / {{ poke.type2 }}</span>
            </p>
            <p v-if="poke.calculated_hp"><strong>HP:</strong> {{ poke.calculated_hp }}</p>
          </div>

          <div class="pokemon-actions">
            <span class="view-hint">Click to view details →</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pokemon-list {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 10px;
}

.separator {
  color: #666;
  font-size: 14px;
}

.current {
  color: #333;
  font-weight: bold;
}

.pokemon-list h1 {
  margin: 0 0 30px 0;
  color: #333;
}

.pokemon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.pokemon-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pokemon-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #007bff;
}

.pokemon-header h3 {
  margin: 0 0 5px 0;
  color: #007bff;
  font-size: 1.3em;
}

.pokemon-species {
  margin: 0 0 15px 0;
  color: #666;
  font-style: italic;
}

.pokemon-summary p {
  margin: 8px 0;
  color: #333;
}

.pokemon-actions {
  margin-top: 15px;
  text-align: right;
}

.view-hint {
  color: #007bff;
  font-size: 14px;
}

.loading,
.error,
.empty {
  text-align: center;
  padding: 40px;
  color: #666;
}

.error {
  color: #dc3545;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  text-decoration: none;
  display: inline-block;
  transition: background-color 0.2s;
}

.btn-small {
  padding: 6px 12px;
  font-size: 12px;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-outline {
  background-color: transparent;
  color: #007bff;
  border: 1px solid #007bff;
}

.btn-outline:hover {
  background-color: #007bff;
  color: white;
}
</style>
