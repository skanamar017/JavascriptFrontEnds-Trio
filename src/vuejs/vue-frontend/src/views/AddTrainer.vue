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

// Component state
const isSubmitting = ref(false);
const error = ref(null);

// Handle form submission
const submitForm = async () => {
  if (!formData.value.name.trim()) {
    error.value = "Name is required";
    return;
  }

  isSubmitting.value = true;
  error.value = null;

  try {
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

    await trainersStore.createTrainer(trainerData);
    router.push("/");
  } catch (err) {
    console.error("Failed to create trainer:", err);
    error.value = "Failed to create trainer. Please try again.";
  } finally {
    isSubmitting.value = false;
  }
};

const goBack = () => {
  router.push("/");
};
</script>

<template>
  <div class="add-trainer">
    <div class="page-header">
      <button @click="goBack" class="btn btn-outline btn-small">← Back to Trainers</button>
      <h1>Add New Trainer</h1>
    </div>

    <div class="form-container">
      <!-- Error message -->
      <div v-if="error" class="error">
        {{ error }}
      </div>

      <!-- Add form -->
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
            {{ isSubmitting ? "Adding..." : "Add Trainer" }}
          </button>

          <button type="button" class="btn btn-outline" @click="goBack" :disabled="isSubmitting">
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

.page-header {
  margin-bottom: 20px;
}

.page-header h1 {
  margin: 10px 0 0 0;
  color: #333;
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
  text-decoration: none;
  display: inline-block;
  transition: background-color 0.2s;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-small {
  padding: 8px 16px;
  font-size: 12px;
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
