<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useTrainersStore } from "@/stores/trainers";

const router = useRouter();
const trainersStore = useTrainersStore();

const trainers = computed(() => trainersStore.trainers);
const loading = computed(() => trainersStore.loading);
const error = computed(() => trainersStore.error);

onMounted(() => {
  trainersStore.fetchTrainers();
});

const viewTrainer = (trainer) => {
  router.push(`/trainers/${trainer.id}`);
};

const addTrainer = () => {
  router.push("/trainers/add");
};
</script>

<template>
  <div class="trainers-list">
    <div class="header">
      <h1>Pokemon Trainers ({{ trainers.length }})</h1>
      <button @click="addTrainer" class="btn btn-primary">Add New Trainer</button>
    </div>

    <div v-if="loading" class="loading">Loading trainers...</div>

    <div v-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="trainersStore.fetchTrainers()" class="btn btn-outline">Retry</button>
    </div>

    <div v-if="!loading && !error" class="trainers-grid">
      <div v-if="trainers.length === 0" class="empty">
        <p>No trainers found. Add some trainers to get started!</p>
        <button @click="addTrainer" class="btn btn-primary">Add First Trainer</button>
      </div>

      <div
        v-for="trainer in trainers"
        :key="trainer.id"
        class="trainer-card"
        @click="viewTrainer(trainer)"
      >
        <h3>{{ trainer.name }}</h3>
        <div class="trainer-details">
          <p v-if="trainer.age"><strong>Age:</strong> {{ trainer.age }}</p>
          <p v-if="trainer.gender"><strong>Gender:</strong> {{ trainer.gender }}</p>
          <p v-if="trainer.occupation"><strong>Occupation:</strong> {{ trainer.occupation }}</p>
        </div>
        <div class="trainer-actions">
          <span class="view-hint">Click to view details →</span>
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

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header h1 {
  margin: 0;
  color: #333;
}

.trainers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.trainer-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.trainer-card h3 {
  margin: 0 0 15px 0;
  color: #007bff;
}

.trainer-details p {
  margin: 5px 0;
  color: #666;
}

.trainer-actions {
  margin-top: 15px;
  text-align: right;
}

.view-hint {
  color: #007bff;
  font-size: 14px;
}

.loading,
.error,
.empty {
  text-align: center;
  padding: 40px;
  color: #666;
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
