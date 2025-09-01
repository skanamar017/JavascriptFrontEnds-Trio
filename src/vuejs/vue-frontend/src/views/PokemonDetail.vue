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
const pokemonId = parseInt(route.params.pokemonId);
const trainer = ref(null);
const pokemon = ref(null);
const loading = ref(true);
const error = ref(null);
const showEditForm = ref(false);
const isSubmitting = ref(false);
const showDeleteConfirm = ref(false);
const isDeleting = ref(false);

const editForm = ref({
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

onMounted(async () => {
  try {
    loading.value = true;
    trainer.value = await trainersStore.getTrainer(trainerId);

    // Find the specific Pokemon from the trainer's team
    await pokemonStore.fetchTrainerPokemon(trainerId);
    const trainerPokemon = pokemonStore.trainerPokemon;
    pokemon.value = trainerPokemon.find((p) => p.id === pokemonId);

    if (!pokemon.value) {
      error.value = "Pokemon not found";
    } else {
      resetEditForm();
    }
  } catch (err) {
    error.value = "Failed to load Pokemon details";
    console.error(err);
  } finally {
    loading.value = false;
  }
});

const resetEditForm = () => {
  if (pokemon.value) {
    editForm.value = {
      pokemon_id: pokemon.value.pokemon_id,
      nickname: pokemon.value.nickname || "",
      level: pokemon.value.level || 1,
      iv_hp: pokemon.value.iv_hp || 0,
      iv_attack: pokemon.value.iv_attack || 0,
      iv_defense: pokemon.value.iv_defense || 0,
      iv_special: pokemon.value.iv_special || 0,
      iv_speed: pokemon.value.iv_speed || 0,
      ev_hp: pokemon.value.ev_hp || 0,
      ev_attack: pokemon.value.ev_attack || 0,
      ev_defense: pokemon.value.ev_defense || 0,
      ev_special: pokemon.value.ev_special || 0,
      ev_speed: pokemon.value.ev_speed || 0,
    };
  }
};

const startEditing = () => {
  resetEditForm();
  showEditForm.value = true;
};

const cancelEdit = () => {
  showEditForm.value = false;
  resetEditForm();
};

const savePokemon = async () => {
  if (!editForm.value.pokemon_id || !editForm.value.nickname.trim()) {
    alert("Pokemon ID and nickname are required!");
    return;
  }

  isSubmitting.value = true;

  try {
    const pokemonData = {
      trainer_id: trainerId,
      pokemon_id: parseInt(editForm.value.pokemon_id),
      nickname: editForm.value.nickname.trim(),
      level: parseInt(editForm.value.level) || 1,
      iv_hp: parseInt(editForm.value.iv_hp) || 0,
      iv_attack: parseInt(editForm.value.iv_attack) || 0,
      iv_defense: parseInt(editForm.value.iv_defense) || 0,
      iv_special: parseInt(editForm.value.iv_special) || 0,
      iv_speed: parseInt(editForm.value.iv_speed) || 0,
      ev_hp: parseInt(editForm.value.ev_hp) || 0,
      ev_attack: parseInt(editForm.value.ev_attack) || 0,
      ev_defense: parseInt(editForm.value.ev_defense) || 0,
      ev_special: parseInt(editForm.value.ev_special) || 0,
      ev_speed: parseInt(editForm.value.ev_speed) || 0,
    };

    await pokemonStore.updateTrainerPokemon(trainerId, pokemonId, pokemonData);

    // Refresh the Pokemon data
    await pokemonStore.fetchTrainerPokemon(trainerId);
    const updatedPokemon = pokemonStore.trainerPokemon.find((p) => p.id === pokemonId);
    pokemon.value = updatedPokemon;

    showEditForm.value = false;
  } catch (err) {
    console.error("Error updating Pokemon:", err);
    alert("Failed to update Pokemon. Please try again.");
  } finally {
    isSubmitting.value = false;
  }
};

const showDeleteConfirmation = () => {
  showDeleteConfirm.value = true;
};

const cancelDelete = () => {
  showDeleteConfirm.value = false;
};

const confirmDelete = async () => {
  isDeleting.value = true;

  try {
    await pokemonStore.deleteTrainerPokemon(trainerId, pokemonId);
    router.push(`/trainers/${trainerId}/pokemon`);
  } catch (err) {
    console.error("Error deleting Pokemon:", err);
    alert("Failed to delete Pokemon. Please try again.");
  } finally {
    isDeleting.value = false;
    showDeleteConfirm.value = false;
  }
};

const goBack = () => {
  router.push(`/trainers/${trainerId}/pokemon`);
};

const goToTrainer = () => {
  router.push(`/trainers/${trainerId}`);
};

const goHome = () => {
  router.push("/");
};
</script>

<template>
  <div class="pokemon-detail">
    <div v-if="loading" class="loading">Loading Pokemon details...</div>

    <div v-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="goBack" class="btn btn-outline">← Back to Pokemon List</button>
    </div>

    <div v-if="pokemon && !loading" class="pokemon-content">
      <div class="header">
        <div class="breadcrumb">
          <button @click="goHome" class="btn btn-outline btn-small">← Trainers</button>
          <span class="separator">/</span>
          <button @click="goToTrainer" class="btn btn-outline btn-small">
            {{ trainer?.name || "Trainer" }}
          </button>
          <span class="separator">/</span>
          <button @click="goBack" class="btn btn-outline btn-small">Pokemon Team</button>
          <span class="separator">/</span>
          <span class="current">{{ pokemon.nickname || pokemon.pokemon_name }}</span>
        </div>
        <div class="header-actions">
          <button @click="startEditing" v-if="!showEditForm" class="btn btn-secondary">Edit</button>
          <button @click="showDeleteConfirmation" class="btn btn-danger">Delete</button>
        </div>
      </div>

      <div v-if="!showEditForm" class="pokemon-info">
        <div class="pokemon-header">
          <h1>{{ pokemon.nickname || pokemon.pokemon_name }}</h1>
          <p v-if="pokemon.nickname" class="pokemon-species">({{ pokemon.pokemon_name }})</p>
        </div>

        <div class="pokemon-basic-info">
          <div class="info-card">
            <h3>Basic Information</h3>
            <div class="info-grid">
              <div class="info-item"><strong>Level:</strong> {{ pokemon.level }}</div>
              <div class="info-item" v-if="pokemon.type1">
                <strong>Type:</strong> {{ pokemon.type1
                }}<span v-if="pokemon.type2"> / {{ pokemon.type2 }}</span>
              </div>
              <div class="info-item"><strong>Pokemon ID:</strong> {{ pokemon.pokemon_id }}</div>
            </div>
          </div>

          <div class="info-card" v-if="pokemon.calculated_hp">
            <h3>Calculated Stats</h3>
            <div class="stats-grid">
              <div class="stat-item"><strong>HP:</strong> {{ pokemon.calculated_hp }}</div>
              <div class="stat-item"><strong>Attack:</strong> {{ pokemon.calculated_attack }}</div>
              <div class="stat-item">
                <strong>Defense:</strong> {{ pokemon.calculated_defense }}
              </div>
              <div class="stat-item"><strong>Speed:</strong> {{ pokemon.calculated_speed }}</div>
              <div class="stat-item">
                <strong>Special:</strong> {{ pokemon.calculated_special }}
              </div>
            </div>
          </div>

          <div class="info-card">
            <h3>Individual Values (IVs)</h3>
            <div class="stats-grid">
              <div class="stat-item"><strong>HP:</strong> {{ pokemon.iv_hp }}</div>
              <div class="stat-item"><strong>Attack:</strong> {{ pokemon.iv_attack }}</div>
              <div class="stat-item"><strong>Defense:</strong> {{ pokemon.iv_defense }}</div>
              <div class="stat-item"><strong>Speed:</strong> {{ pokemon.iv_speed }}</div>
              <div class="stat-item"><strong>Special:</strong> {{ pokemon.iv_special }}</div>
            </div>
          </div>

          <div class="info-card">
            <h3>Effort Values (EVs)</h3>
            <div class="stats-grid">
              <div class="stat-item"><strong>HP:</strong> {{ pokemon.ev_hp }}</div>
              <div class="stat-item"><strong>Attack:</strong> {{ pokemon.ev_attack }}</div>
              <div class="stat-item"><strong>Defense:</strong> {{ pokemon.ev_defense }}</div>
              <div class="stat-item"><strong>Speed:</strong> {{ pokemon.ev_speed }}</div>
              <div class="stat-item"><strong>Special:</strong> {{ pokemon.ev_special }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit Form -->
      <div v-if="showEditForm" class="edit-form">
        <h2>Edit Pokemon</h2>
        <form @submit.prevent="savePokemon">
          <div class="form-row">
            <div class="form-group">
              <label for="pokemon_id">Pokemon ID *</label>
              <input
                id="pokemon_id"
                v-model="editForm.pokemon_id"
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
                v-model="editForm.nickname"
                type="text"
                required
                :disabled="isSubmitting"
              />
            </div>

            <div class="form-group">
              <label for="level">Level</label>
              <input
                id="level"
                v-model="editForm.level"
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
                v-model="editForm.iv_hp"
                type="number"
                min="0"
                max="15"
                :disabled="isSubmitting"
              />
            </div>
            <div class="form-group">
              <label>Attack IV</label>
              <input
                v-model="editForm.iv_attack"
                type="number"
                min="0"
                max="15"
                :disabled="isSubmitting"
              />
            </div>
            <div class="form-group">
              <label>Defense IV</label>
              <input
                v-model="editForm.iv_defense"
                type="number"
                min="0"
                max="15"
                :disabled="isSubmitting"
              />
            </div>
            <div class="form-group">
              <label>Speed IV</label>
              <input
                v-model="editForm.iv_speed"
                type="number"
                min="0"
                max="15"
                :disabled="isSubmitting"
              />
            </div>
            <div class="form-group">
              <label>Special IV</label>
              <input
                v-model="editForm.iv_special"
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
                v-model="editForm.ev_hp"
                type="number"
                min="0"
                max="65535"
                :disabled="isSubmitting"
              />
            </div>
            <div class="form-group">
              <label>Attack EV</label>
              <input
                v-model="editForm.ev_attack"
                type="number"
                min="0"
                max="65535"
                :disabled="isSubmitting"
              />
            </div>
            <div class="form-group">
              <label>Defense EV</label>
              <input
                v-model="editForm.ev_defense"
                type="number"
                min="0"
                max="65535"
                :disabled="isSubmitting"
              />
            </div>
            <div class="form-group">
              <label>Speed EV</label>
              <input
                v-model="editForm.ev_speed"
                type="number"
                min="0"
                max="65535"
                :disabled="isSubmitting"
              />
            </div>
            <div class="form-group">
              <label>Special EV</label>
              <input
                v-model="editForm.ev_special"
                type="number"
                min="0"
                max="65535"
                :disabled="isSubmitting"
              />
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
              {{ isSubmitting ? "Updating..." : "Update Pokemon" }}
            </button>
            <button
              type="button"
              @click="cancelEdit"
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
        <h3>Delete Pokemon</h3>
        <p>
          Are you sure you want to delete
          <strong>{{ pokemon?.nickname || pokemon?.pokemon_name }}</strong
          >? This action cannot be undone.
        </p>
        <div class="modal-actions">
          <button @click="confirmDelete" class="btn btn-danger" :disabled="isDeleting">
            {{ isDeleting ? "Deleting..." : "Delete" }}
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
.pokemon-detail {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
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

.header-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.pokemon-header h1 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 2.5em;
}

.pokemon-species {
  margin: 0 0 30px 0;
  color: #666;
  font-style: italic;
  font-size: 1.2em;
}

.pokemon-basic-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.info-card {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.info-card h3 {
  margin: 0 0 15px 0;
  color: #333;
  border-bottom: 2px solid #007bff;
  padding-bottom: 5px;
}

.info-grid,
.stats-grid {
  display: grid;
  gap: 10px;
}

.info-item,
.stat-item {
  padding: 8px;
  background: white;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
}

.stats-grid {
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
}

.edit-form {
  background: #f9f9f9;
  padding: 30px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.edit-form h2 {
  margin: 0 0 20px 0;
  color: #333;
}

.edit-form h4 {
  margin: 30px 0 15px 0;
  color: #333;
  border-bottom: 1px solid #ddd;
  padding-bottom: 5px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

.form-group input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
}

.modal-content h3 {
  margin: 0 0 15px 0;
  color: #333;
}

.modal-content p {
  margin-bottom: 20px;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.loading,
.error {
  text-align: center;
  padding: 40px;
}

.error {
  color: #dc3545;
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

.btn-small {
  padding: 6px 12px;
  font-size: 12px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
</style>
