<template>
  <div class="database-panel">
    <h2 class="panel-heading">Database</h2>
    <div class="panel-content">
      <p class="placeholder-text">Define your data models and relationships</p>
      
      <div class="model-list">
        <div class="model-item">
          <div class="model-header">
            <span class="model-icon">📊</span>
            <h3>User</h3>
            <button class="edit-button">Edit</button>
          </div>
          <div class="model-fields">
            <div class="field">
              <span class="field-name">id</span>
              <span class="field-type">UUID</span>
            </div>
            <div class="field">
              <span class="field-name">email</span>
              <span class="field-type">String</span>
            </div>
            <div class="field">
              <span class="field-name">name</span>
              <span class="field-type">String</span>
            </div>
            <div class="field">
              <span class="field-name">createdAt</span>
              <span class="field-type">DateTime</span>
            </div>
          </div>
        </div>

        <div class="model-item">
          <div class="model-header">
            <span class="model-icon">📊</span>
            <h3>Post</h3>
            <button class="edit-button">Edit</button>
          </div>
          <div class="model-fields">
            <div class="field">
              <span class="field-name">id</span>
              <span class="field-type">UUID</span>
            </div>
            <div class="field">
              <span class="field-name">title</span>
              <span class="field-type">String</span>
            </div>
            <div class="field">
              <span class="field-name">content</span>
              <span class="field-type">Text</span>
            </div>
            <div class="field">
              <span class="field-name">authorId</span>
              <span class="field-type">UUID</span>
              <span class="field-relation">→ User</span>
            </div>
          </div>
        </div>
      </div>

      <button class="add-button">
        <span>+</span> Add New Model
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
.database-panel {
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

.model-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.model-item {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 0.5rem;
  padding: 1.5rem;
}

.model-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.model-icon {
  font-size: 1.5rem;
}

.model-header h3 {
  color: var(--text-primary);
  font-size: 1.125rem;
  font-weight: 600;
  flex: 1;
}

.edit-button {
  background-color: var(--border-primary);
  border: 1px solid var(--border-secondary);
  border-radius: 0.375rem;
  padding: 0.375rem 0.75rem;
  color: var(--text-primary);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.edit-button:hover {
  background-color: var(--border-secondary);
}

.model-fields {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  background-color: var(--bg-primary);
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.field-name {
  color: var(--text-primary);
  font-weight: 500;
  min-width: 120px;
}

.field-type {
  color: var(--primary-500);
  font-family: monospace;
}

.field-relation {
  color: var(--success-500);
  margin-left: auto;
  font-size: 0.75rem;
}

.add-button {
  background-color: var(--border-primary);
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
  background-color: var(--border-secondary);
}

.add-button span {
  font-size: 1.25rem;
}
</style>