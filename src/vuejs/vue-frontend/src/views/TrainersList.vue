<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useTrainersStore } from "@/stores/trainers";

const router = useRouter();
const trainersStore = useTrainersStore();

// Component state
const trainers = computed(() => trainersStore.trainers);
const loading = computed(() => trainersStore.loading);
const error = computed(() => trainersStore.error);

// Delete confirmation
const showDeleteConfirm = ref(false);
const trainerToDelete = ref(null);
const isDeleting = ref(false);

// Load trainers data
onMounted(async () => {
  try {
    await trainersStore.fetchAllTrainers();
  } catch (err) {
    console.error("Failed to load trainers:", err);
  }
});

// Navigate to add trainer page
const showAddTrainerForm = () => {
  router.push("/trainers/add");
};

// Navigate to edit trainer page
const showEditTrainerForm = (trainer) => {
  router.push(`/trainers/${trainer.id}/edit`);
};

// Navigate to trainer's Pokemon
const viewTrainerPokemon = (trainer) => {
  router.push(`/trainers/${trainer.id}/pokemon`);
};

// Show delete confirmation
const showDeleteConfirmation = (trainer) => {
  trainerToDelete.value = trainer;
  showDeleteConfirm.value = true;
};

// Cancel delete
const cancelDelete = () => {
  showDeleteConfirm.value = false;
  trainerToDelete.value = null;
};

// Confirm delete
const confirmDelete = async () => {
  if (!trainerToDelete.value) return;

  isDeleting.value = true;

  try {
    await trainersStore.deleteTrainer(trainerToDelete.value.id);
    await trainersStore.fetchAllTrainers();
  } catch (err) {
    console.error("Failed to delete trainer:", err);
  } finally {
    isDeleting.value = false;
    showDeleteConfirm.value = false;
    trainerToDelete.value = null;
  }
};
</script>

<template>
  <div class="trainers-list">
    <!-- Header -->
    <div class="header-section">
      <h1>Pokemon Trainers ({{ trainers.length }})</h1>
      <button @click="showAddTrainerForm" class="btn btn-primary">+ Add New Trainer</button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading">Loading trainers...</div>

    <!-- Error -->
    <div v-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="trainersStore.clearError()" class="btn btn-small">Clear Error</button>
    </div>

    <!-- Trainers List -->
    <div v-if="!loading && !error" class="trainers-section">
      <div v-if="trainers.length === 0" class="empty">
        <p>No trainers found. Add some trainers to get started!</p>
        <button @click="showAddTrainerForm" class="btn btn-primary">Add First Trainer</button>
      </div>

      <div v-else class="trainers-grid">
        <div v-for="trainer in trainers" :key="trainer.id" class="trainer-card">
          <h3>{{ trainer.name }}</h3>

          <div class="trainer-details">
            <p v-if="trainer.age"><strong>Age:</strong> {{ trainer.age }}</p>
            <p v-if="trainer.gender"><strong>Gender:</strong> {{ trainer.gender }}</p>
            <p v-if="trainer.occupation"><strong>Occupation:</strong> {{ trainer.occupation }}</p>
          </div>

          <div class="trainer-actions">
            <button @click="viewTrainerPokemon(trainer)" class="btn btn-info btn-small">
              View Pokemon
            </button>
            <button @click="showEditTrainerForm(trainer)" class="btn btn-secondary btn-small">
              Edit
            </button>
            <button @click="showDeleteConfirmation(trainer)" class="btn btn-danger btn-small">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="modal-overlay" @click="cancelDelete">
      <div class="modal-content" @click.stop>
        <h3>Confirm Delete</h3>
        <p>
          Are you sure you want to delete <strong>{{ trainerToDelete?.name }}</strong
          >?
          <br />
          <small>This will also delete all their Pokemon. This action cannot be undone.</small>
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
.trainers-list {
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
  margin: 0;
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

.trainers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.trainer-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.trainer-card h3 {
  margin: 0 0 15px 0;
  color: #2c3e50;
  font-size: 1.4em;
}

.trainer-details p {
  margin: 8px 0;
  color: #666;
}

.trainer-actions {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  flex-wrap: wrap;
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

.modal-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 20px;
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

.btn-info {
  background-color: #17a2b8;
  color: white;
}

.btn-info:hover:not(:disabled) {
  background-color: #138496;
}
</style>
