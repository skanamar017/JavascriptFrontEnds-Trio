<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useTrainersStore } from "@/stores/trainers";

const route = useRoute();
const router = useRouter();
const trainersStore = useTrainersStore();

const trainerId = parseInt(route.params.id);
const trainer = ref(null);
const loading = ref(true);
const error = ref(null);
const showEditForm = ref(false);
const isSubmitting = ref(false);

const editForm = ref({
  name: "",
  age: "",
  gender: "",
  occupation: "",
});

onMounted(async () => {
  try {
    loading.value = true;
    trainer.value = await trainersStore.getTrainer(trainerId);
    resetEditForm();
  } catch (err) {
    error.value = "Failed to load trainer details";
    console.error(err);
  } finally {
    loading.value = false;
  }
});

const resetEditForm = () => {
  if (trainer.value) {
    editForm.value = {
      name: trainer.value.name || "",
      age: trainer.value.age || "",
      gender: trainer.value.gender || "",
      occupation: trainer.value.occupation || "",
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

const saveTrainer = async () => {
  if (!editForm.value.name.trim()) {
    alert("Trainer name is required!");
    return;
  }

  isSubmitting.value = true;

  try {
    const trainerData = {
      name: editForm.value.name.trim(),
      age: editForm.value.age ? parseInt(editForm.value.age) : null,
      gender: editForm.value.gender || null,
      occupation: editForm.value.occupation || null,
    };

    const updatedTrainer = await trainersStore.updateTrainer(trainerId, trainerData);
    trainer.value = updatedTrainer;
    showEditForm.value = false;
  } catch (err) {
    console.error("Error updating trainer:", err);
    alert("Failed to update trainer. Please try again.");
  } finally {
    isSubmitting.value = false;
  }
};

const deleteTrainer = async () => {
  const confirmDelete = confirm(
    `Are you sure you want to delete trainer "${trainer.value.name}"? This action cannot be undone.`
  );

  if (!confirmDelete) return;

  try {
    await trainersStore.deleteTrainer(trainerId);
    router.push("/");
  } catch (err) {
    console.error("Error deleting trainer:", err);
    alert("Failed to delete trainer. Please try again.");
  }
};

const viewPokemon = () => {
  router.push(`/trainers/${trainerId}/pokemon`);
};

const goBack = () => {
  router.push("/");
};
</script>

<template>
  <div class="trainer-detail">
    <div v-if="loading" class="loading">Loading trainer details...</div>

    <div v-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="goBack" class="btn btn-outline">← Back to Trainers</button>
    </div>

    <div v-if="trainer && !loading" class="trainer-content">
      <div class="header">
        <button @click="goBack" class="btn btn-outline">← Back to Trainers</button>
        <div class="header-actions">
          <button @click="viewPokemon" class="btn btn-primary">View Pokemon Team</button>
          <button @click="startEditing" v-if="!showEditForm" class="btn btn-secondary">Edit</button>
          <button @click="deleteTrainer" class="btn btn-danger">Delete</button>
        </div>
      </div>

      <div v-if="!showEditForm" class="trainer-info">
        <h1>{{ trainer.name }}</h1>
        <div class="trainer-details">
          <div class="detail-item" v-if="trainer.age"><strong>Age:</strong> {{ trainer.age }}</div>
          <div class="detail-item" v-if="trainer.gender">
            <strong>Gender:</strong> {{ trainer.gender }}
          </div>
          <div class="detail-item" v-if="trainer.occupation">
            <strong>Occupation:</strong> {{ trainer.occupation }}
          </div>
          <div class="detail-item"><strong>Trainer ID:</strong> {{ trainer.id }}</div>
        </div>
      </div>

      <div v-if="showEditForm" class="edit-form">
        <h2>Edit Trainer</h2>
        <form @submit.prevent="saveTrainer">
          <div class="form-group">
            <label for="name">Name (required):</label>
            <input
              id="name"
              v-model="editForm.name"
              type="text"
              required
              :disabled="isSubmitting"
            />
          </div>

          <div class="form-group">
            <label for="age">Age:</label>
            <input
              id="age"
              v-model="editForm.age"
              type="number"
              min="1"
              max="100"
              :disabled="isSubmitting"
            />
          </div>

          <div class="form-group">
            <label for="gender">Gender:</label>
            <select id="gender" v-model="editForm.gender" :disabled="isSubmitting">
              <option value="">Select...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div class="form-group">
            <label for="occupation">Occupation:</label>
            <input
              id="occupation"
              v-model="editForm.occupation"
              type="text"
              :disabled="isSubmitting"
            />
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
              {{ isSubmitting ? "Updating..." : "Update Trainer" }}
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
  </div>
</template>

<style scoped>
.trainer-detail {
  padding: 20px;
  max-width: 800px;
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

.header-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.trainer-info h1 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 2.5em;
}

.trainer-details {
  background: #f9f9f9;
  padding: 25px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.detail-item {
  margin-bottom: 15px;
  font-size: 16px;
}

.detail-item strong {
  color: #333;
  margin-right: 10px;
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

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
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

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-outline {
  background-color: transparent;
  color: #007bff;
  border: 1px solid #007bff;
}

</style>
