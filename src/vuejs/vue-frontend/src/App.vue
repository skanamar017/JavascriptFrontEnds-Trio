<script setup>
// Remove the TrainersList import since router will handle it
</script>

<template>
  <div id="app">
    <header class="app-header">
      <h1>Pokemon Trainer Manager</h1>
    </header>

    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.app-header {
  background-color: #2c3e50;
  color: white;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.app-header h1 {
  margin: 0;
  font-size: 2em;
}

.app-main {
  padding: 0;
}
</style>
