<template>
  <div class="wizard-nav">
    <NuxtLink to="/wizard" class="nav-link" :class="{ active: route.path === '/wizard' }">
      <span class="nav-icon">🧙</span>
      <span class="nav-text">Original Wizard</span>
    </NuxtLink>
    <NuxtLink to="/wizards" class="nav-link" :class="{ active: route.path === '/wizards' }">
      <span class="nav-icon">🔮</span>
      <span class="nav-text">All Wizards</span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<style scoped>
.wizard-nav {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-primary);
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.2s;
}

.nav-link:hover {
  background: var(--bg-quaternary);
  color: var(--text-primary);
  border-color: var(--primary-500);
}

.nav-link.active {
  background: rgba(22, 193, 129, 0.1);
  color: var(--primary-500);
  border-color: var(--primary-500);
}

.nav-icon {
  font-size: 1.25rem;
}

.nav-text {
  font-weight: 500;
}

@media (max-width: 768px) {
  .wizard-nav {
    padding: 0.75rem;
  }
  
  .nav-link {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
  
  .nav-text {
    display: none;
  }
}
</style>