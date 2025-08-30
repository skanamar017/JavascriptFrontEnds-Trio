<script setup>
import { onMounted, computed, ref } from "vue";
import { useTrainersStore } from "@/stores/trainers";
import { RouterLink } from "vue-router";

const trainersStore = useTrainersStore();

// Computed properties for reactive data
const trainers = computed(() => trainersStore.trainers);
const loading = computed(() => trainersStore.loading);
const error = computed(() => trainersStore.error);

// Delete confirmation state
const showDeleteConfirm = ref(false);
const trainerToDelete = ref(null);
const isDeleting = ref(false);

// Fetch trainers when component mounts
onMounted(async () => {
  await trainersStore.fetchAllTrainers();
});

// Helper function to clear errors
const clearError = () => {
  trainersStore.clearError();
};

// Show delete confirmation dialog
const showDeleteConfirmation = (trainer) => {
  trainerToDelete.value = trainer;
  showDeleteConfirm.value = true;
};

// Cancel delete operation
const cancelDelete = () => {
  showDeleteConfirm.value = false;
  trainerToDelete.value = null;
};

// Confirm and execute delete
const confirmDelete = async () => {
  if (!trainerToDelete.value) return;

  isDeleting.value = true;

  try {
    await trainersStore.deleteTrainer(trainerToDelete.value.id);
    // Refresh the trainers list
    await trainersStore.fetchAllTrainers();
  } catch (error) {
    console.error("Failed to delete trainer:", error);
  } finally {
    isDeleting.value = false;
    showDeleteConfirm.value = false;
    trainerToDelete.value = null;
  }
};
</script>

<template>
  <div class="trainers-list">
    <div class="header-section">
      <h1>Pokemon Trainers</h1>
      <RouterLink to="/add-trainer" class="btn btn-primary"> + Add New Trainer </RouterLink>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="loading">Loading trainers...</div>

    <!-- Error state -->
    <div v-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="clearError" class="btn btn-small">Clear Error</button>
    </div>

    <!-- Trainers list -->
    <div v-if="!loading && !error" class="trainers-grid">
      <div v-for="trainer in trainers" :key="trainer.id" class="trainer-card">
        <h3>{{ trainer.name }}</h3>
        <div class="trainer-details">
          <p><strong>Age:</strong> {{ trainer.age || "Unknown" }}</p>
          <p><strong>Gender:</strong> {{ trainer.gender || "Unknown" }}</p>
          <p><strong>Occupation:</strong> {{ trainer.occupation || "Trainer" }}</p>
        </div>

        <!-- Action buttons -->
        <div class="card-actions">
          <RouterLink :to="`/trainer/${trainer.id}/pokemon`" class="btn btn-info btn-small">
            Pokemon
          </RouterLink>
          <RouterLink :to="`/edit-trainer/${trainer.id}`" class="btn btn-secondary btn-small">
            Edit
          </RouterLink>
          <button
            @click="showDeleteConfirmation(trainer)"
            class="btn btn-danger btn-small"
            :disabled="isDeleting"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="!loading && !error && trainers.length === 0" class="empty">
      <p>No trainers found.</p>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="modal-overlay" @click="cancelDelete">
      <div class="modal-content" @click.stop>
        <h3>Confirm Delete</h3>
        <p>
          Are you sure you want to delete <strong>{{ trainerToDelete?.name }}</strong
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
.trainers-list {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-section h1 {
  margin: 0;
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
  margin-top: 20px;
}

.trainer-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.trainer-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.trainer-card h3 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 1.4em;
}

.trainer-details p {
  margin: 8px 0;
  color: #666;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  text-decoration: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  display: inline-block;
  transition: background-color 0.2s;
}

.btn-primary {
  background-color: #28a745;
  color: white;
}

.btn-primary:hover {
  background-color: #218838;
}

.btn-small {
  padding: 5px 15px;
  font-size: 12px;
}

.card-actions {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background-color: #c82333;
}

.btn-info {
  background-color: #17a2b8;
  color: white;
}

.btn-info:hover:not(:disabled) {
  background-color: #138496;
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
  max-width: 400px;
  width: 90%;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-content h3 {
  margin: 0 0 15px 0;
  color: #333;
}

.modal-content p {
  margin: 0 0 25px 0;
  color: #666;
  line-height: 1.5;
}

.modal-content small {
  color: #999;
  font-style: italic;
}

.modal-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.modal-actions .btn {
  min-width: 100px;
}
</style>
