<template>
  <div class="map-placeholder">
    <div class="content">
      <div class="icon">
        <svg viewBox="0 0 24 24" width="64" height="64">
          <path fill="currentColor" d="M9 2l7.5 3L21 3v16l-4.5 2L9 18l-7.5 3V5l7.5-3zm0 2.1L7 5v11.9l2-.9V4.1zm7 1.8l-5-2v12l5 2v-12zm5-.9l-3 1.3v12l3-1.3V5z"/>
        </svg>
      </div>
      
      <h1>Map Mode</h1>
      <p>Visualize your project structure and navigate between components with ease.</p>
      <p class="subtext">Coming soon - an interactive visual map of your entire project.</p>
      
      <div class="actions">
        <button @click="$router.push(`/project/${$route.params.slug}?mode=builder`)" class="secondary-btn">
          Back to Builder
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Simple placeholder - no logic needed
</script>

<style scoped>
.map-placeholder {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
}

.content {
  text-align: center;
  max-width: 600px;
  padding: 2rem;
}

.icon {
  margin-bottom: 2rem;
  color: var(--primary-500);
  opacity: 0.8;
}

h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

p {
  font-size: 1.125rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1rem;
}

p.subtext {
  font-size: 1rem;
  color: var(--text-tertiary);
  margin-bottom: 3rem;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.primary-btn,
.secondary-btn {
  padding: 0.75rem 2rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  border: none;
}

.primary-btn {
  background: var(--primary-500);
  color: white;
}

.primary-btn:hover {
  background: var(--primary-600);
  transform: translateY(-2px);
}

.secondary-btn {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-primary);
}

.secondary-btn:hover {
  background: var(--bg-secondary);
  border-color: var(--border-secondary);
}

@media (max-width: 768px) {
  h1 {
    font-size: 2rem;
  }
  
  .actions {
    flex-direction: column;
  }
  
  .primary-btn,
  .secondary-btn {
    width: 100%;
  }
}
</style>