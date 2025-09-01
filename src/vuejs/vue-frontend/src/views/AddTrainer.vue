<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useTrainersStore } from "@/stores/trainers";

const router = useRouter();
const trainersStore = useTrainersStore();

const trainerForm = ref({
  name: "",
  age: "",
  occupation: "",
});

const isSubmitting = ref(false);

const submitTrainer = async () => {
  if (!trainerForm.value.name.trim()) {
    return;
  }

  isSubmitting.value = true;

  try {
    await trainersStore.createTrainer(trainerForm.value);
    router.push("/");
  } catch (error) {
    console.error("Failed to create trainer:", error);
  } finally {
    isSubmitting.value = false;
  }
};

const cancel = () => {
  router.push("/");
};
</script>

<template>
  <div class="add-trainer">
    <div class="header">
      <button @click="cancel" class="btn btn-outline">← Back</button>
      <h1>Add New Trainer</h1>
    </div>

    <form @submit.prevent="submitTrainer" class="trainer-form">
      <div class="form-group">
        <label for="name">Name *</label>
        <input id="name" v-model="trainerForm.name" type="text" required :disabled="isSubmitting" />
      </div>

      <div class="form-group">
        <label for="age">Age</label>
        <input id="age" v-model="trainerForm.age" type="number" min="1" :disabled="isSubmitting" />
      </div>

      <div class="form-group">
        <label for="occupation">Occupation</label>
        <input
          id="occupation"
          v-model="trainerForm.occupation"
          type="text"
          :disabled="isSubmitting"
        />
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
          {{ isSubmitting ? "Creating..." : "Create Trainer" }}
        </button>
        <button type="button" @click="cancel" class="btn btn-outline" :disabled="isSubmitting">
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.add-trainer {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.trainer-form {
  background: #f9f9f9;
  padding: 30px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
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

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #0056b3;
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
