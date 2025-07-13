<template>
  <div class="pages-panel">
    <h2 class="panel-heading">Pages</h2>
    <div class="panel-content">
      <p class="placeholder-text">Manage your application pages and routes</p>
      <div class="placeholder-list">
        <div class="placeholder-item">
          <span class="page-icon">📄</span>
          <span>Home Page</span>
        </div>
        <div class="placeholder-item">
          <span class="page-icon">📄</span>
          <span>About Page</span>
        </div>
        <div class="placeholder-item">
          <span class="page-icon">📄</span>
          <span>Contact Page</span>
        </div>
      </div>
      <button class="add-button">
        <span>+</span> Add New Page
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  project?: any
}

const props = defineProps<Props>()
</script>

<style scoped>
.pages-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.panel-heading {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.placeholder-text {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.placeholder-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.placeholder-item {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-primary);
  transition: background-color 0.2s;
}

.placeholder-item:hover {
  background-color: var(--bg-tertiary);
}

.page-icon {
  font-size: 1.25rem;
}

.add-button {
  background-color: var(--bg-tertiary);
  border: 1px solid var(--border-secondary);
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  color: var(--text-primary);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: auto;
}

.add-button:hover {
  background-color: var(--bg-quaternary);
}

.add-button span {
  font-size: 1.25rem;
}
</style>