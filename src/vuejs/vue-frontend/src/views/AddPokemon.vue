<!-- filepath: /Users/sai/Documents/Projects/eighth-week/JavascriptFrontEnds-Trio/src/vuejs/vue-frontend/src/components/AddPokemon.vue -->
<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePokemonStore } from "@/stores/pokemon";
import { useTrainersStore } from "@/stores/trainers";

// Define props to receive trainerId from route
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const route = useRoute();
const router = useRouter();
const pokemonStore = usePokemonStore();
const trainersStore = useTrainersStore();

// Use props.id or fallback to route.params.id
const trainerId = parseInt(props.id || route.params.id);
const trainer = ref(null);
const allPokemon = computed(() => pokemonStore.allPokemon);
const loading = computed(() => pokemonStore.loading);
const error = computed(() => pokemonStore.error);
const isSubmitting = ref(false);

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

onMounted(async () => {
  console.log("AddPokemon mounted with trainerId:", trainerId);

  if (!trainerId || isNaN(trainerId)) {
    console.error("Invalid trainerId:", trainerId);
    router.push("/");
    return;
  }

  try {
    trainer.value = await trainersStore.getTrainer(trainerId);
    await pokemonStore.fetchAllPokemon();
  } catch (err) {
    console.error("Failed to load data:", err);
  }
});

const submitForm = async () => {
  console.log("Submitting form with trainerId:", trainerId);

  if (!pokemonForm.value.pokemon_id || !pokemonForm.value.nickname.trim()) {
    alert("Pokemon and nickname are required!");
    return;
  }

  if (!trainerId || isNaN(trainerId)) {
    alert("Invalid trainer ID");
    return;
  }

  isSubmitting.value = true;

  try {
    const pokemonData = {
      trainer_id: trainerId,
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

    console.log("Adding Pokemon with data:", pokemonData);
    await pokemonStore.createTrainerPokemon(trainerId, pokemonData);
    router.push(`/trainers/${trainerId}/pokemon`);
  } catch (err) {
    console.error("Failed to add Pokemon:", err);
    alert("Failed to add Pokemon. Please try again.");
  } finally {
    isSubmitting.value = false;
  }
};

const cancel = () => {
  router.push(`/trainers/${trainerId}/pokemon`);
};
</script>

<template>
  <div class="add-pokemon">
    <h1>Add Pokemon to {{ trainer?.name || "Trainer" }}'s Team</h1>

    <div v-if="loading" class="loading">Loading...</div>

    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="cancel" class="btn btn-outline">Cancel</button>
    </div>

    <form v-else @submit.prevent="submitForm" class="pokemon-form">
      <div class="form-group">
        <label for="pokemon_id">Pokemon *</label>
        <select id="pokemon_id" v-model="pokemonForm.pokemon_id" required :disabled="isSubmitting">
          <option value="">Select a Pokemon...</option>
          <option v-for="pokemon in allPokemon" :key="pokemon.id" :value="pokemon.id">
            #{{ pokemon.id }} - {{ pokemon.name }}
          </option>
        </select>
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

      <div class="form-actions">
        <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
          {{ isSubmitting ? "Adding..." : "Add Pokemon" }}
        </button>
        <button type="button" @click="cancel" class="btn btn-outline" :disabled="isSubmitting">
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.add-pokemon {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.pokemon-form {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
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

.loading,
.error {
  text-align: center;
  padding: 20px;
}
</style>
