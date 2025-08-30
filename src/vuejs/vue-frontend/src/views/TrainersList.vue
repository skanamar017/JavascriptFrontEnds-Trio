<script setup>
import { onMounted, computed } from "vue";
import { useTrainersStore } from "@/stores/trainers";
import { RouterLink } from "vue-router";

const trainersStore = useTrainersStore();

// Computed properties for reactive data
const trainers = computed(() => trainersStore.trainers);
const loading = computed(() => trainersStore.loading);
const error = computed(() => trainersStore.error);

// Fetch trainers when component mounts
onMounted(async () => {
  await trainersStore.fetchAllTrainers();
});

// Helper function to clear errors
const clearError = () => {
  trainersStore.clearError();
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
          <RouterLink :to="`/edit-trainer/${trainer.id}`" class="btn btn-secondary btn-small">
            Edit
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="!loading && !error && trainers.length === 0" class="empty">
      <p>No trainers found.</p>
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
</style>
