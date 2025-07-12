<template>
  <div class="wizard-magic">
    <div class="process-header">
      <h2 class="process-title">
        <span style="font-size: 1.25rem;">✨</span>
        Behind the Magic
      </h2>
      <p class="process-subtitle">Watch AI think and build in real-time</p>
    </div>

    <div class="process-content">
      <!-- Process Sections -->
      <div 
        v-for="(section, index) in sections" 
        :key="index"
        class="process-section"
        :style="{ animationDelay: `${index * 0.2}s` }"
      >
        <h3 class="process-section-title">
          <div v-if="section.loading" class="loader">
            <div class="loader-dot"></div>
            <div class="loader-dot"></div>
            <div class="loader-dot"></div>
          </div>
          {{ section.title }}
        </h3>

        <!-- Default Layout Items -->
        <template v-if="section.layout === 'default'">
          <div 
            v-for="(item, itemIndex) in section.items" 
            :key="itemIndex"
            class="process-item"
            :class="{ 
              active: item.status === 'processing',
              selected: item.selected 
            }"
            :style="{ animationDelay: `${itemIndex * 0.1}s` }"
            @click="$emit('item-click', { section: index, item: itemIndex })"
          >
            <div 
              class="process-icon" 
              :style="{ background: getIconBackground(item.status) }"
            >
              {{ item.icon }}
            </div>
            <div class="process-text">{{ item.text }}</div>
            <div v-if="item.status" :class="`process-status status-${item.status}`">
              <template v-if="item.status === 'complete'">✓</template>
            </div>
          </div>
        </template>

        <!-- Page Grid Layout -->
        <div v-else-if="section.layout === 'page-grid'" class="page-grid">
          <div 
            v-for="(item, itemIndex) in section.items" 
            :key="itemIndex"
            class="page-item"
            :class="{ selected: item.selected }"
            :style="{ animationDelay: `${itemIndex * 0.1}s` }"
            @click="$emit('item-click', { section: index, item: itemIndex })"
          >
            <div class="page-icon">{{ item.icon }}</div>
            <div class="page-name">{{ item.text }}</div>
          </div>
        </div>

        <!-- Feature List Layout -->
        <div v-else-if="section.layout === 'feature-list'" class="feature-list">
          <div 
            v-for="(item, itemIndex) in section.items" 
            :key="itemIndex"
            class="feature-item"
            :class="{ selected: item.selected }"
            :style="{ animationDelay: `${itemIndex * 0.1}s` }"
            @click="$emit('item-click', { section: index, item: itemIndex })"
          >
            <div class="feature-check">✓</div>
            <span>{{ item.text }}</span>
          </div>
        </div>

        <!-- Color Palette -->
        <div v-if="section.colorPalette" class="color-palette">
          <div 
            v-for="(color, colorIndex) in section.colorPalette" 
            :key="colorIndex"
            class="color-swatch"
            :class="{ selected: color.selected }"
            :style="{ background: color.hex }"
            :title="color.name"
            @click="$emit('color-select', { section: index, color: colorIndex })"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ProcessItem {
  icon: string
  text: string
  status?: 'complete' | 'processing' | 'pending'
  selected?: boolean
}

interface ColorItem {
  hex: string
  name: string
  selected?: boolean
}

interface ProcessSection {
  title: string
  loading?: boolean
  layout?: 'default' | 'page-grid' | 'feature-list'
  items: ProcessItem[]
  colorPalette?: ColorItem[]
}

interface Props {
  sections?: ProcessSection[]
}

withDefaults(defineProps<Props>(), {
  sections: () => []
})

defineEmits<{
  'item-click': [payload: { section: number; item: number }]
  'color-select': [payload: { section: number; color: number }]
}>()

const getIconBackground = (status?: string) => {
  switch(status) {
    case 'complete': return 'rgba(22, 193, 129, 0.2)'
    case 'processing': return 'rgba(234, 179, 8, 0.2)'
    default: return 'var(--bg-tertiary)'
  }
}
</script>

<style scoped>
.wizard-magic {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.process-header {
  padding: 2rem;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-primary);
}

.process-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-primary);
}

.process-subtitle {
  color: var(--text-tertiary);
  font-size: 0.875rem;
}

.process-content {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  -webkit-overflow-scrolling: touch;
}

/* Process Items */
.process-section {
  margin-bottom: 2rem;
  animation: fadeIn 0.6s ease-out;
  animation-fill-mode: both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.process-section-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.process-item {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s;
  cursor: pointer;
  opacity: 0;
  animation: processItemSlide 0.4s ease-out forwards;
}

@keyframes processItemSlide {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.process-item:hover {
  background: var(--bg-tertiary);
  transform: translateX(-2px);
}

.process-item.active {
  border-color: var(--primary-500);
  background: rgba(22, 193, 129, 0.05);
}

.process-item.selected {
  border-color: var(--purple-500);
  background: rgba(139, 92, 246, 0.1);
}

.process-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.process-text {
  flex: 1;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.process-status {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
}

.status-complete {
  background: var(--primary-500);
  color: white;
}

.status-processing {
  background: var(--yellow-500);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(0.9); }
}

/* Color Palette */
.color-palette {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
}

.color-swatch {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
  border: 2px solid transparent;
}

.color-swatch:hover {
  transform: scale(1.1);
  border-color: rgba(255, 255, 255, 0.3);
}

.color-swatch.selected {
  border-color: var(--primary-500);
  transform: scale(1.1);
  box-shadow: 0 0 0 3px rgba(22, 193, 129, 0.3);
}

/* Page Grid */
.page-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 1rem;
}

.page-item {
  background: var(--bg-tertiary);
  border: 2px solid var(--border-primary);
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  transition: all 0.3s;
  cursor: pointer;
  opacity: 0;
  animation: pageItemPop 0.4s ease-out forwards;
  position: relative;
  overflow: hidden;
}

@keyframes pageItemPop {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.page-item:hover {
  border-color: var(--primary-500);
  transform: translateY(-2px);
  background: rgba(22, 193, 129, 0.05);
}

.page-item.selected {
  border-color: var(--primary-500);
  background: rgba(22, 193, 129, 0.1);
}

.page-item.selected::after {
  content: '✓';
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 24px;
  height: 24px;
  background: var(--primary-500);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.875rem;
  font-weight: 700;
  animation: checkPop 0.3s ease-out;
}

@keyframes checkPop {
  from { transform: scale(0); }
  to { transform: scale(1); }
}

.page-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.page-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

/* Feature List */
.feature-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: var(--bg-tertiary);
  border: 2px solid var(--border-primary);
  border-radius: 8px;
  font-size: 0.875rem;
  opacity: 0;
  animation: featureSlide 0.3s ease-out forwards;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--text-secondary);
}

.feature-item:hover {
  background: var(--bg-quaternary);
  border-color: rgba(22, 193, 129, 0.3);
}

.feature-item.selected {
  border-color: var(--purple-500);
  background: rgba(139, 92, 246, 0.1);
}

@keyframes featureSlide {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.feature-check {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--primary-500);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.75rem;
}

/* Loader */
.loader {
  display: inline-flex;
  gap: 0.25rem;
}

.loader-dot {
  width: 4px;
  height: 4px;
  background: var(--primary-500);
  border-radius: 50%;
  animation: loaderBounce 1.4s ease-in-out infinite;
}

.loader-dot:nth-child(2) { animation-delay: 0.2s; }
.loader-dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes loaderBounce {
  0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
  40% { transform: scale(1.2); opacity: 1; }
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .process-header {
    padding: calc(var(--safe-area-top) + 1rem) 1rem 1rem;
  }

  .process-content {
    padding: 1rem;
    padding-bottom: 100px;
  }

  .page-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  .page-item {
    padding: 0.875rem;
  }

  .page-icon {
    font-size: 1.5rem;
  }

  .page-name {
    font-size: 0.75rem;
  }
}

/* Tablet Adjustments */
@media (min-width: 769px) and (max-width: 1024px) {
  .process-header {
    padding: 1.5rem;
  }

  .process-content {
    padding: 1.5rem;
  }
}
</style>