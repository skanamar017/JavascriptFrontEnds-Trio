<script setup>
import { ref } from "vue";
import { useTrainersStore } from "@/stores/trainers";
import { useRouter } from "vue-router";

const trainersStore = useTrainersStore();
const router = useRouter();

// Form data
const formData = ref({
  name: "",
  age: null,
  gender: "",
  occupation: "",
});

// Form state
const isSubmitting = ref(false);
const error = ref(null);

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

    // Create the trainer
    await trainersStore.createTrainer(trainerData);

    // Redirect back to trainers list
    router.push("/");
  } catch (err) {
    error.value = "Failed to create trainer. Please try again.";
  } finally {
    isSubmitting.value = false;
  }
};

// Clear form
const clearForm = () => {
  formData.value = {
    name: "",
    age: null,
    gender: "",
    occupation: "",
  };
  error.value = null;
};
</script>

<template>
  <div class="add-trainer">
    <div class="form-container">
      <h1>Add New Trainer</h1>

      <!-- Error message -->
      <div v-if="error" class="error">
        {{ error }}
      </div>

      <form @submit.prevent="submitForm" class="trainer-form">
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
            {{ isSubmitting ? "Creating..." : "Create Trainer" }}
          </button>

          <button
            type="button"
            class="btn btn-secondary"
            @click="clearForm"
            :disabled="isSubmitting"
          >
            Clear Form
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
.add-trainer {
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

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #545b62;
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
