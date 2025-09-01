<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePokemonStore } from "@/stores/pokemon";
import { useTrainersStore } from "@/stores/trainers";
import ApiService from "@/services/api";

const route = useRoute();
const router = useRouter();
const pokemonStore = usePokemonStore();
const trainersStore = useTrainersStore();

const trainerId = parseInt(route.params.id);

// Component state
const trainer = ref(null);
const pokemon = computed(() => pokemonStore.trainerPokemon);
const loading = computed(() => pokemonStore.loading);
const error = computed(() => pokemonStore.error);

// Form state for adding Pokemon
const showAddForm = ref(false);
const showEditForm = ref(false);
const editingPokemon = ref(null);
const isSubmitting = ref(false);

// Form data
const pokemonForm = ref({
  pokemon_id: null,
  nickname: "",
  level: 1,
  iv_hp: 0,
  iv_attack: 0,
  iv_defense: 0,
  iv_special: 0,
  iv_speed: 0,
  ev_hp: 0,
  ev_attack: 0,
  ev_defense: 0,
  ev_special: 0,
  ev_speed: 0,
});

// Delete confirmation
const showDeleteConfirm = ref(false);
const pokemonToDelete = ref(null);
const isDeleting = ref(false);

// Load trainer and Pokemon data
onMounted(async () => {
  try {
    // Load trainer info
    trainer.value = await ApiService.getTrainer(trainerId);
    // Load trainer's Pokemon
    await pokemonStore.fetchTrainerPokemon(trainerId);
  } catch (err) {
    console.error("Failed to load data:", err);
  }
});

// Reset form
const resetForm = () => {
  pokemonForm.value = {
    pokemon_id: null,
    nickname: "",
    level: 1,
    iv_hp: 0,
    iv_attack: 0,
    iv_defense: 0,
    iv_special: 0,
    iv_speed: 0,
    ev_hp: 0,
    ev_attack: 0,
    ev_defense: 0,
    ev_special: 0,
    ev_speed: 0,
  };
};

// Show add form
const showAddPokemonForm = () => {
  resetForm();
  showAddForm.value = true;
  showEditForm.value = false;
};

// Show edit form
const showEditPokemonForm = (pokemonData) => {
  pokemonForm.value = { ...pokemonData };
  editingPokemon.value = pokemonData;
  showEditForm.value = true;
  showAddForm.value = false;
};

// Cancel form
const cancelForm = () => {
  showAddForm.value = false;
  showEditForm.value = false;
  editingPokemon.value = null;
  resetForm();
};

// Submit form (add or edit)
const submitPokemonForm = async () => {
  if (!pokemonForm.value.pokemon_id || !pokemonForm.value.nickname.trim()) {
    error.value = "Pokemon ID and nickname are required";
    return;
  }

  isSubmitting.value = true;

  try {
    // Ensure all required fields are present and properly typed
    const pokemonData = {
      trainer_id: trainerId, // Make sure trainer_id is included
      pokemon_id: parseInt(pokemonForm.value.pokemon_id),
      nickname: pokemonForm.value.nickname.trim(),
      level: parseInt(pokemonForm.value.level) || 1,
      iv_hp: parseInt(pokemonForm.value.iv_hp) || 0,
      iv_attack: parseInt(pokemonForm.value.iv_attack) || 0,
      iv_defense: parseInt(pokemonForm.value.iv_defense) || 0,
      iv_special: parseInt(pokemonForm.value.iv_special) || 0,
      iv_speed: parseInt(pokemonForm.value.iv_speed) || 0,
      ev_hp: parseInt(pokemonForm.value.ev_hp) || 0,
      ev_attack: parseInt(pokemonForm.value.ev_attack) || 0,
      ev_defense: parseInt(pokemonForm.value.ev_defense) || 0,
      ev_special: parseInt(pokemonForm.value.ev_special) || 0,
      ev_speed: parseInt(pokemonForm.value.ev_speed) || 0,
    };

    console.log("Submitting Pokemon data:", pokemonData); // Debug log

    if (showEditForm.value && editingPokemon.value) {
      // Update existing Pokemon
      await pokemonStore.updateTrainerPokemon(trainerId, editingPokemon.value.id, pokemonData);
    } else {
      // Add new Pokemon
      await pokemonStore.createTrainerPokemon(trainerId, pokemonData);
    }

    // Refresh Pokemon list
    await pokemonStore.fetchTrainerPokemon(trainerId);
    cancelForm();
  } catch (err) {
    console.error("Failed to save Pokemon:", err);
    error.value = "Failed to save Pokemon. Please check the console for details.";
  } finally {
    isSubmitting.value = false;
  }
};

// Show delete confirmation
const showDeleteConfirmation = (pokemonData) => {
  pokemonToDelete.value = pokemonData;
  showDeleteConfirm.value = true;
};

// Cancel delete
const cancelDelete = () => {
  showDeleteConfirm.value = false;
  pokemonToDelete.value = null;
};

// Confirm delete
const confirmDelete = async () => {
  if (!pokemonToDelete.value) return;

  isDeleting.value = true;

  try {
    await pokemonStore.deleteTrainerPokemon(trainerId, pokemonToDelete.value.id);
    await pokemonStore.fetchTrainerPokemon(trainerId);
  } catch (err) {
    console.error("Failed to delete Pokemon:", err);
  } finally {
    isDeleting.value = false;
    showDeleteConfirm.value = false;
    pokemonToDelete.value = null;
  }
};
</script>

<template>
  <div class="trainer-pokemon">
    <!-- Header -->
    <div class="header-section">
      <div>
        <button @click="router.push('/')" class="btn btn-outline btn-small">
          ← Back to Trainers
        </button>
        <h1 v-if="trainer">{{ trainer.name }}'s Pokemon Team</h1>
        <h1 v-else>Pokemon Team</h1>
      </div>
      <button @click="showAddPokemonForm" class="btn btn-primary">+ Add Pokemon</button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading">Loading Pokemon...</div>

    <!-- Error -->
    <div v-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="pokemonStore.clearError()" class="btn btn-small">Clear Error</button>
    </div>

    <!-- Pokemon List -->
    <div v-if="!loading && !error" class="pokemon-section">
      <div v-if="pokemon.length === 0" class="empty">
        <p>This trainer has no Pokemon yet.</p>
        <button @click="showAddPokemonForm" class="btn btn-primary">Add First Pokemon</button>
      </div>

      <div v-else class="pokemon-grid">
        <div v-for="poke in pokemon" :key="poke.id" class="pokemon-card">
          <!-- Pokemon Header with name and species -->
          <div class="pokemon-header">
            <h3>{{ poke.nickname || poke.pokemon_name }}</h3>
            <p v-if="poke.nickname" class="pokemon-species">({{ poke.pokemon_name }})</p>
          </div>

          <div class="pokemon-details">
            <p><strong>Level:</strong> {{ poke.level }}</p>
            <p v-if="poke.type1">
              <strong>Type:</strong> {{ poke.type1
              }}<span v-if="poke.type2"> / {{ poke.type2 }}</span>
            </p>
          </div>

          <!-- Calculated Stats Section -->
          <div v-if="poke.calculated_hp" class="stats-section">
            <h4>Calculated Stats</h4>
            <div class="stats-grid calculated-stats">
              <span>HP: {{ poke.calculated_hp }}</span>
              <span>ATK: {{ poke.calculated_attack }}</span>
              <span>DEF: {{ poke.calculated_defense }}</span>
              <span>SPD: {{ poke.calculated_speed }}</span>
              <span>SPC: {{ poke.calculated_special }}</span>
            </div>
          </div>

          <!-- IVs Section -->
          <div class="stats-section">
            <h4>Individual Values (IVs)</h4>
            <div class="stats-grid">
              <span>ATK: {{ poke.iv_attack }}</span>
              <span>DEF: {{ poke.iv_defense }}</span>
              <span>SPD: {{ poke.iv_speed }}</span>
              <span>SPC: {{ poke.iv_special }}</span>
            </div>
          </div>

          <!-- EVs Section (optional - you can remove if not needed) -->
          <div class="stats-section">
            <h4>Effort Values (EVs)</h4>
            <div class="stats-grid">
              <span>HP: {{ poke.ev_hp }}</span>
              <span>ATK: {{ poke.ev_attack }}</span>
              <span>DEF: {{ poke.ev_defense }}</span>
              <span>SPD: {{ poke.ev_speed }}</span>
              <span>SPC: {{ poke.ev_special }}</span>
            </div>
          </div>

          <div class="pokemon-actions">
            <button @click="showEditPokemonForm(poke)" class="btn btn-secondary btn-small">
              Edit
            </button>
            <button @click="showDeleteConfirmation(poke)" class="btn btn-danger btn-small">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Pokemon Form -->
    <div v-if="showAddForm || showEditForm" class="modal-overlay" @click="cancelForm">
      <div class="modal-content large-modal" @click.stop>
        <h3>{{ showEditForm ? "Edit Pokemon" : "Add New Pokemon" }}</h3>

        <form @submit.prevent="submitPokemonForm" class="pokemon-form">
          <div class="form-row">
            <div class="form-group">
              <label for="pokemon_id">Pokemon ID *</label>
              <input
                id="pokemon_id"
                v-model="pokemonForm.pokemon_id"
                type="number"
                min="1"
                max="151"
                required
                :disabled="isSubmitting"
              />
            </div>

            <div class="form-group">
              <label for="nickname">Nickname *</label>
              <input
                id="nickname"
                v-model="pokemonForm.nickname"
                type="text"
                required
                :disabled="isSubmitting"
              />
            </div>

            <div class="form-group">
              <label for="level">Level</label>
              <input
                id="level"
                v-model="pokemonForm.level"
                type="number"
                min="1"
                max="100"
                :disabled="isSubmitting"
              />
            </div>
          </div>

          <h4>Individual Values (IVs)</h4>
          <div class="form-row">
            <div class="form-group">
              <label>HP IV</label>
              <input
                v-model="pokemonForm.iv_hp"
                type="number"
                min="0"
                max="15"
                :disabled="isSubmitting"
              />
            </div>
            <div class="form-group">
              <label>Attack IV</label>
              <input
                v-model="pokemonForm.iv_attack"
                type="number"
                min="0"
                max="15"
                :disabled="isSubmitting"
              />
            </div>
            <div class="form-group">
              <label>Defense IV</label>
              <input
                v-model="pokemonForm.iv_defense"
                type="number"
                min="0"
                max="15"
                :disabled="isSubmitting"
              />
            </div>
            <div class="form-group">
              <label>Special IV</label>
              <input
                v-model="pokemonForm.iv_special"
                type="number"
                min="0"
                max="15"
                :disabled="isSubmitting"
              />
            </div>
            <div class="form-group">
              <label>Speed IV</label>
              <input
                v-model="pokemonForm.iv_speed"
                type="number"
                min="0"
                max="15"
                :disabled="isSubmitting"
              />
            </div>
          </div>

          <h4>Effort Values (EVs)</h4>
          <div class="form-row">
            <div class="form-group">
              <label>HP EV</label>
              <input
                v-model="pokemonForm.ev_hp"
                type="number"
                min="0"
                max="65535"
                :disabled="isSubmitting"
              />
            </div>
            <div class="form-group">
              <label>Attack EV</label>
              <input
                v-model="pokemonForm.ev_attack"
                type="number"
                min="0"
                max="65535"
                :disabled="isSubmitting"
              />
            </div>
            <div class="form-group">
              <label>Defense EV</label>
              <input
                v-model="pokemonForm.ev_defense"
                type="number"
                min="0"
                max="65535"
                :disabled="isSubmitting"
              />
            </div>
            <div class="form-group">
              <label>Special EV</label>
              <input
                v-model="pokemonForm.ev_special"
                type="number"
                min="0"
                max="65535"
                :disabled="isSubmitting"
              />
            </div>
            <div class="form-group">
              <label>Speed EV</label>
              <input
                v-model="pokemonForm.ev_speed"
                type="number"
                min="0"
                max="65535"
                :disabled="isSubmitting"
              />
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
              {{ isSubmitting ? "Saving..." : showEditForm ? "Update Pokemon" : "Add Pokemon" }}
            </button>
            <button
              type="button"
              @click="cancelForm"
              class="btn btn-outline"
              :disabled="isSubmitting"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="modal-overlay" @click="cancelDelete">
      <div class="modal-content" @click.stop>
        <h3>Confirm Delete</h3>
        <p>
          Are you sure you want to delete <strong>{{ pokemonToDelete?.nickname }}</strong
          >?
          <br />
          <small>This action cannot be undone.</small>
        </p>

        <div class="modal-actions">
          <button @click="confirmDelete" class="btn btn-danger" :disabled="isDeleting">
            {{ isDeleting ? "Deleting..." : "Yes, Delete" }}
          </button>
          <button @click="cancelDelete" class="btn btn-outline" :disabled="isDeleting">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.trainer-pokemon {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header-section h1 {
  margin: 10px 0 0 0;
  color: #333;
}

.loading,
.error,
.empty {
  text-align: center;
  padding: 40px 20px;
}

.error {
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  margin-bottom: 20px;
}

.pokemon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.pokemon-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.pokemon-header {
  margin-bottom: 15px;
  border-bottom: 2px solid #ecf0f1;
  padding-bottom: 10px;
}

.pokemon-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.4em;
}

.pokemon-species {
  margin: 5px 0 0 0;
  color: #7f8c8d;
  font-style: italic;
  font-size: 14px;
}

.calculated-stats {
  background-color: #e8f5e8;
  padding: 10px;
  border-radius: 6px;
  font-weight: 600;
}

.calculated-stats span {
  color: #2d5a2d;
}

.pokemon-details p {
  margin: 8px 0;
  color: #666;
}

.stats-section {
  margin: 15px 0;
}

.stats-section h4 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 0.9em;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
  gap: 8px;
  font-size: 0.85em;
  color: #666;
}

.stats-grid span {
  background: #f0f0f0;
  padding: 4px 8px;
  border-radius: 4px;
  text-align: center;
  font-size: 12px;
}

.pokemon-actions {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  overflow-y: auto;
}

.modal-content {
  background: white;
  border-radius: 8px;
  padding: 30px;
  max-width: 500px;
  width: 90%;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  margin: 20px;
}

.large-modal {
  max-width: 700px;
  text-align: left;
}

.pokemon-form h4 {
  margin: 20px 0 10px 0;
  color: #333;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
  font-size: 0.9em;
}

.form-group input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  text-decoration: none;
  display: inline-block;
  transition: background-color 0.2s;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-small {
  padding: 5px 15px;
  font-size: 12px;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #5a6268;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background-color: #c82333;
}

.btn-outline {
  background-color: transparent;
  color: #007bff;
  border: 1px solid #007bff;
}

.btn-outline:hover:not(:disabled) {
  background-color: #007bff;
  color: white;
}

.modal-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}
</style>
