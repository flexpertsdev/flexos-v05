<template>
  <div class="journeys-panel">
    <h2 class="panel-heading">User Journeys</h2>
    <div class="panel-content">
      <p class="placeholder-text">Map out your user flows and experiences</p>
      <div class="journey-list">
        <div class="journey-item">
          <div class="journey-header">
            <span class="journey-icon">🚀</span>
            <h3>Onboarding Flow</h3>
          </div>
          <div class="journey-steps">
            <span class="step">Sign Up</span>
            <span class="arrow">→</span>
            <span class="step">Profile Setup</span>
            <span class="arrow">→</span>
            <span class="step">Welcome</span>
          </div>
        </div>
        <div class="journey-item">
          <div class="journey-header">
            <span class="journey-icon">🛒</span>
            <h3>Purchase Flow</h3>
          </div>
          <div class="journey-steps">
            <span class="step">Browse</span>
            <span class="arrow">→</span>
            <span class="step">Add to Cart</span>
            <span class="arrow">→</span>
            <span class="step">Checkout</span>
          </div>
        </div>
      </div>
      <button class="add-button">
        <span>+</span> Add New Journey
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
.journeys-panel {
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

.journey-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.journey-item {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 0.5rem;
  padding: 1.5rem;
}

.journey-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.journey-icon {
  font-size: 1.5rem;
}

.journey-header h3 {
  color: var(--text-primary);
  font-size: 1.125rem;
  font-weight: 600;
}

.journey-steps {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.step {
  background-color: var(--border-primary);
  border: 1px solid var(--border-secondary);
  border-radius: 0.375rem;
  padding: 0.5rem 1rem;
  color: var(--text-primary);
  font-size: 0.875rem;
}

.arrow {
  color: var(--text-tertiary);
  font-size: 1.125rem;
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