<!-- filepath: /Users/sai/Documents/Projects/eighth-week/JavascriptFrontEnds-Trio/src/vuejs/vue-frontend/src/components/AddPokemon.vue -->
<script setup>
import { ref, reactive } from "vue";
import { usePokemonStore } from "@/stores/pokemon";

const props = defineProps({
  trainerId: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["close", "success"]);

const pokemonStore = usePokemonStore();
const isSubmitting = ref(false);

// Form data
const pokemonForm = reactive({
  pokemon_id: null,
  nickname: "",
  level: 1,
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

// Submit form
const submitForm = async () => {
  if (!pokemonForm.pokemon_id || !pokemonForm.nickname.trim()) {
    alert("Pokemon ID and nickname are required");
    return;
  }

  isSubmitting.value = true;

  try {
    // Prepare data for API
    const pokemonData = {
      trainer_id: props.trainerId,
      pokemon_id: parseInt(pokemonForm.pokemon_id),
      nickname: pokemonForm.nickname.trim(),
      level: parseInt(pokemonForm.level) || 1,
      iv_attack: parseInt(pokemonForm.iv_attack) || 0,
      iv_defense: parseInt(pokemonForm.iv_defense) || 0,
      iv_special: parseInt(pokemonForm.iv_special) || 0,
      iv_speed: parseInt(pokemonForm.iv_speed) || 0,
      ev_hp: parseInt(pokemonForm.ev_hp) || 0,
      ev_attack: parseInt(pokemonForm.ev_attack) || 0,
      ev_defense: parseInt(pokemonForm.ev_defense) || 0,
      ev_special: parseInt(pokemonForm.ev_special) || 0,
      ev_speed: parseInt(pokemonForm.ev_speed) || 0,
    };

    console.log("Adding Pokemon:", pokemonData);

    // Add new Pokemon
    await pokemonStore.createTrainerPokemon(props.trainerId, pokemonData);

    // Emit success to parent
    emit("success");
  } catch (err) {
    console.error("Failed to add Pokemon:", err);
    alert("Failed to add Pokemon. Please check the console for details.");
  } finally {
    isSubmitting.value = false;
  }
};

// Cancel form
const cancelForm = () => {
  emit("close");
};
</script>

<template>
  <div class="modal-overlay" @click="cancelForm">
    <div class="modal-content large-modal" @click.stop>
      <h3>Add New Pokemon</h3>

      <form @submit.prevent="submitForm" class="pokemon-form">
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
            {{ isSubmitting ? "Adding..." : "Add Pokemon" }}
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
</template>

<style scoped>
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

/* Button styles */
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

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-outline {
  background-color: transparent;
  color: #007bff;
  border: 1px solid #007bff;
}
</style>
