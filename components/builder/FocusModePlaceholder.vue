<template>
  <div class="focus-placeholder">
    <div class="content">
      <div class="icon">
        <svg viewBox="0 0 24 24" width="64" height="64">
          <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
        </svg>
      </div>
      
      <h1>Focus Mode</h1>
      <p>A distraction-free environment for deep work is coming soon.</p>
      
      <div class="actions">
        <NuxtLink to="/wizards/project-discovery" class="primary-btn">
          Start with Project Wizard
        </NuxtLink>
        <button @click="$router.back()" class="secondary-btn">
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
.focus-placeholder {
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
}

.primary-btn {
  background: var(--primary-500);
  color: white;
  border: none;
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