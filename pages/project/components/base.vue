<template>
  <div class="flexos-builder">
    <BuilderLayout :project="mockProject" />
  </div>
</template>

<script setup lang="ts">
import BuilderLayout from './BuilderLayout.vue'

// Mock project data for testing
const mockProject = {
  id: 'test-project-123',
  slug: 'test-project',
  name: 'My Test Project',
  description: 'A test project for component development',
  user_id: 'user-123',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  last_accessed_at: new Date().toISOString()
}
</script>

<style>
/* Global styles - Import Inter font */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

/* CSS Variables for FlexOS design system */
:root {
  --bg-primary: #0F1419;
  --bg-secondary: #1A1F26;
  --bg-tertiary: #242B33;
  --bg-quaternary: #2D3440;
  --text-primary: #F7F9FA;
  --text-secondary: #D1D9E0;
  --text-tertiary: #8B949E;
  --text-muted: #6E7681;
  --border-primary: #30363D;
  --border-secondary: #3A4046;
  --primary-500: #16C181;
  --primary-400: #34D399;
  --primary-600: #10A574;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.5);
  
  /* Mobile specific */
  --safe-area-top: env(safe-area-inset-top, 0);
  --safe-area-bottom: env(safe-area-inset-bottom, 0);
  --mobile-header-height: 56px;
}

/* Reset */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Base styles */
.flexos-builder {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  height: 100vh;
  height: 100dvh;
  background: var(--bg-primary);
  color: var(--text-primary);
  overflow: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Common icon styles */
.icon {
  width: 20px;
  height: 20px;
  stroke: currentColor;
  stroke-width: 2;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* Common button styles */
.btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: var(--primary-500);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-600);
  transform: translateY(-1px);
}

.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
}

.btn-ghost:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}
</style>