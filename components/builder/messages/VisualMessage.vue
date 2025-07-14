<template>
  <div class="visual-message">
    <div v-if="data.type === 'chart'" class="chart-container">
      <!-- Placeholder for chart -->
      <div class="placeholder">
        <svg viewBox="0 0 24 24" class="icon">
          <path d="M3 13h2v7H3v-7zm4-8h2v15H7V5zm4 4h2v11h-2V9zm4-2h2v13h-2V7zm4 4h2v9h-2v-9z"/>
        </svg>
        <p>{{ data.title || 'Chart Visualization' }}</p>
      </div>
    </div>
    
    <div v-else-if="data.type === 'diagram'" class="diagram-container">
      <!-- Placeholder for diagram -->
      <div class="placeholder">
        <svg viewBox="0 0 24 24" class="icon">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM8 17.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zM9.5 8c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5S9.5 9.38 9.5 8zm6.5 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
        <p>{{ data.title || 'Diagram' }}</p>
      </div>
    </div>
    
    <div v-else class="image-container">
      <img v-if="data.url" :src="data.url" :alt="data.alt || 'Visual content'" />
      <div v-else class="placeholder">
        <svg viewBox="0 0 24 24" class="icon">
          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
        </svg>
        <p>{{ data.title || 'Visual Content' }}</p>
      </div>
    </div>
    
    <p v-if="data.caption" class="caption">{{ data.caption }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  data: {
    type?: 'image' | 'chart' | 'diagram'
    url?: string
    title?: string
    alt?: string
    caption?: string
  }
}

const props = defineProps<Props>()
</script>

<style scoped>
.visual-message {
  padding: 1rem;
}

.chart-container,
.diagram-container,
.image-container {
  background: var(--bg-secondary);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: var(--text-tertiary);
}

.icon {
  width: 48px;
  height: 48px;
  fill: currentColor;
  margin-bottom: 1rem;
}

.placeholder p {
  margin: 0;
  font-size: 0.875rem;
}

img {
  width: 100%;
  height: auto;
  display: block;
}

.caption {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-style: italic;
  margin-top: 0.5rem;
  text-align: center;
}
</style>