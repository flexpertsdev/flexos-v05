<template>
  <div class="design-panel">
    <h2 class="panel-heading">Design</h2>
    <div class="panel-content">
      <p class="placeholder-text">Customize your app's visual appearance</p>
      
      <div class="design-section">
        <h3>Theme Colors</h3>
        <div class="color-grid">
          <div class="color-item">
            <div class="color-box" style="background-color: var(--primary-500);"></div>
            <span>Primary</span>
          </div>
          <div class="color-item">
            <div class="color-box" style="background-color: var(--success-500);"></div>
            <span>Success</span>
          </div>
          <div class="color-item">
            <div class="color-box" style="background-color: var(--danger-500);"></div>
            <span>Danger</span>
          </div>
          <div class="color-item">
            <div class="color-box" style="background-color: var(--warning-500);"></div>
            <span>Warning</span>
          </div>
        </div>
      </div>

      <div class="design-section">
        <h3>Typography</h3>
        <div class="font-options">
          <div class="font-item">
            <label>Font Family</label>
            <select class="font-select">
              <option>Inter</option>
              <option>Roboto</option>
              <option>Open Sans</option>
              <option>Poppins</option>
            </select>
          </div>
          <div class="font-item">
            <label>Base Size</label>
            <select class="font-select">
              <option>14px</option>
              <option selected>16px</option>
              <option>18px</option>
            </select>
          </div>
        </div>
      </div>

      <div class="design-section">
        <h3>Layout</h3>
        <div class="layout-options">
          <label class="layout-option">
            <input type="radio" name="layout" checked>
            <span>Light Mode</span>
          </label>
          <label class="layout-option">
            <input type="radio" name="layout">
            <span>Dark Mode</span>
          </label>
          <label class="layout-option">
            <input type="radio" name="layout">
            <span>Auto</span>
          </label>
        </div>
      </div>
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
.design-panel {
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
}

.placeholder-text {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.design-section {
  margin-bottom: 2rem;
}

.design-section h3 {
  color: var(--text-primary);
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 1rem;
}

.color-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.color-box {
  width: 60px;
  height: 60px;
  border-radius: 0.5rem;
  border: 1px solid var(--border-primary);
  cursor: pointer;
  transition: transform 0.2s;
}

.color-box:hover {
  transform: scale(1.05);
}

.color-item span {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.font-options {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.font-item {
  flex: 1;
  min-width: 200px;
}

.font-item label {
  display: block;
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.font-select {
  width: 100%;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 0.375rem;
  padding: 0.5rem;
  color: var(--text-primary);
  font-size: 0.875rem;
  cursor: pointer;
}

.font-select:focus {
  outline: none;
  border-color: var(--primary-500);
}

.layout-options {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.layout-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: var(--text-primary);
}

.layout-option input[type="radio"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}
</style>