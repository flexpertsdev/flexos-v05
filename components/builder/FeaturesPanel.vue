<template>
  <div class="features-panel">
    <h2 class="panel-heading">Features</h2>
    <div class="panel-content">
      <p class="placeholder-text">Configure your app features and capabilities</p>
      <div class="feature-grid">
        <div class="feature-card">
          <div class="feature-icon">🔐</div>
          <h3>Authentication</h3>
          <p>User login and registration</p>
          <label class="toggle">
            <input type="checkbox" checked>
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div class="feature-card">
          <div class="feature-icon">💾</div>
          <h3>Database</h3>
          <p>Data storage and retrieval</p>
          <label class="toggle">
            <input type="checkbox" checked>
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div class="feature-card">
          <div class="feature-icon">📧</div>
          <h3>Email</h3>
          <p>Send transactional emails</p>
          <label class="toggle">
            <input type="checkbox">
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div class="feature-card">
          <div class="feature-icon">💳</div>
          <h3>Payments</h3>
          <p>Accept online payments</p>
          <label class="toggle">
            <input type="checkbox">
            <span class="toggle-slider"></span>
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
.features-panel {
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

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.feature-card {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 0.5rem;
  padding: 1.5rem;
  position: relative;
}

.feature-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.feature-card h3 {
  color: var(--text-primary);
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.feature-card p {
  color: var(--text-tertiary);
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.toggle {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  display: inline-block;
  width: 48px;
  height: 24px;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--border-primary);
  transition: 0.4s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: var(--text-tertiary);
  transition: 0.4s;
  border-radius: 50%;
}

.toggle input:checked + .toggle-slider {
  background-color: var(--primary-500);
}

.toggle input:checked + .toggle-slider:before {
  background-color: var(--text-primary);
  transform: translateX(24px);
}
</style>