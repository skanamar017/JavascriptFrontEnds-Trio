<script setup>
import { ref, onMounted } from "vue";
import { useTrainersStore } from "@/stores/trainers";
import { useRouter, useRoute } from "vue-router";
import ApiService from "@/services/api"; // Import ApiService directly

const trainersStore = useTrainersStore();
const router = useRouter();
const route = useRoute();

const trainerId = parseInt(route.params.id);

// Form data
const formData = ref({
  name: "",
  age: null,
  gender: "",
  occupation: "",
});

// Component state
const isLoading = ref(true);
const isSubmitting = ref(false);
const error = ref(null);
const trainer = ref(null);

// Load trainer data when component mounts
onMounted(async () => {
  try {
    isLoading.value = true;
    error.value = null;

    // Fetch the specific trainer using ApiService directly
    trainer.value = await ApiService.getTrainer(trainerId);

    // Populate form with trainer data
    formData.value = {
      name: trainer.value.name || "",
      age: trainer.value.age || null,
      gender: trainer.value.gender || "",
      occupation: trainer.value.occupation || "",
    };
  } catch (err) {
    error.value = "Failed to load trainer data";
  } finally {
    isLoading.value = false;
  }
});

// Handle form submission
const submitForm = async () => {
  // Basic validation
  if (!formData.value.name.trim()) {
    error.value = "Name is required";
    return;
  }

  isSubmitting.value = true;
  error.value = null;

  try {
    // Create trainer object, only include non-empty fields
    const trainerData = {
      name: formData.value.name.trim(),
    };

    if (formData.value.age && formData.value.age > 0) {
      trainerData.age = parseInt(formData.value.age);
    }

    if (formData.value.gender.trim()) {
      trainerData.gender = formData.value.gender.trim();
    }

    if (formData.value.occupation.trim()) {
      trainerData.occupation = formData.value.occupation.trim();
    }

    // Update the trainer using ApiService directly
    await ApiService.updateTrainer(trainerId, trainerData);

    // Refresh the trainers list
    await trainersStore.fetchAllTrainers();

    // Redirect back to trainers list
    router.push("/");
  } catch (err) {
    error.value = "Failed to update trainer. Please try again.";
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="edit-trainer">
    <div class="form-container">
      <h1>Edit Trainer</h1>

      <!-- Loading state -->
      <div v-if="isLoading" class="loading">Loading trainer data...</div>

      <!-- Error message -->
      <div v-if="error" class="error">
        {{ error }}
      </div>

      <!-- Edit form -->
      <form v-if="!isLoading" @submit.prevent="submitForm" class="trainer-form">
        <!-- Name field (required) -->
        <div class="form-group">
          <label for="name">Name *</label>
          <input
            id="name"
            v-model="formData.name"
            type="text"
            placeholder="Enter trainer name"
            required
            :disabled="isSubmitting"
          />
        </div>

        <!-- Age field -->
        <div class="form-group">
          <label for="age">Age</label>
          <input
            id="age"
            v-model="formData.age"
            type="number"
            placeholder="Enter age"
            min="1"
            max="100"
            :disabled="isSubmitting"
          />
        </div>

        <!-- Gender field -->
        <div class="form-group">
          <label for="gender">Gender</label>
          <select id="gender" v-model="formData.gender" :disabled="isSubmitting">
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <!-- Occupation field -->
        <div class="form-group">
          <label for="occupation">Occupation</label>
          <input
            id="occupation"
            v-model="formData.occupation"
            type="text"
            placeholder="e.g., Gym Leader, Trainer, Elite Four"
            :disabled="isSubmitting"
          />
        </div>

        <!-- Form buttons -->
        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
            {{ isSubmitting ? "Updating..." : "Update Trainer" }}
          </button>

          <button
            type="button"
            class="btn btn-outline"
            @click="router.push('/')"
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
.edit-trainer {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.form-container {
  background: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.loading {
  text-align: center;
  padding: 40px 20px;
  color: #666;
}

.trainer-form {
  margin-top: 20px;
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

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 30px;
}

.btn {
  padding: 12px 20px;
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

.error {
  background-color: #f8d7da;
  color: #721c24;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 20px;
  border: 1px solid #f5c6cb;
}
</style>
