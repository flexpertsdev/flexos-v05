<template>
  <div class="design-message">
    <div class="design-header">
      <h4 class="design-title">{{ data.title || 'Design Element' }}</h4>
      <span class="design-type">{{ data.designType || 'Component' }}</span>
    </div>
    
    <div v-if="data.preview" class="design-preview">
      <div v-html="data.preview" class="preview-content"></div>
    </div>
    
    <div v-if="data.specs" class="design-specs">
      <h5 class="specs-title">Specifications</h5>
      <div class="specs-grid">
        <div v-for="(value, key) in data.specs" :key="key" class="spec-item">
          <span class="spec-label">{{ formatLabel(key) }}:</span>
          <span class="spec-value">{{ value }}</span>
        </div>
      </div>
    </div>
    
    <div v-if="data.colors" class="color-palette">
      <h5 class="palette-title">Color Palette</h5>
      <div class="colors-grid">
        <div v-for="color in data.colors" :key="color.name" class="color-item">
          <div class="color-swatch" :style="{ backgroundColor: color.value }"></div>
          <span class="color-name">{{ color.name }}</span>
          <span class="color-value">{{ color.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  data: {
    title?: string
    designType?: string
    preview?: string
    specs?: Record<string, any>
    colors?: Array<{
      name: string
      value: string
    }>
  }
}

const props = defineProps<Props>()

const formatLabel = (key: string) => {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
}
</script>

<style scoped>
.design-message {
  padding: 1rem;
}

.design-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.design-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.design-type {
  font-size: 0.75rem;
  color: var(--primary-500);
  background: var(--primary-100);
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
}

.design-preview {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
}

.preview-content {
  /* Content styles will be inherited */
}

.design-specs,
.color-palette {
  margin-top: 1.5rem;
}

.specs-title,
.palette-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
}

.specs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
}

.spec-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  background: var(--bg-secondary);
  border-radius: 4px;
}

.spec-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.spec-value {
  font-size: 0.75rem;
  color: var(--text-primary);
  font-weight: 500;
}

.colors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
}

.color-item {
  text-align: center;
}

.color-swatch {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  border: 1px solid var(--border-primary);
}

.color-name {
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.color-value {
  display: block;
  font-size: 0.625rem;
  color: var(--text-secondary);
}
</style>