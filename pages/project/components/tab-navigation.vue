<template>
  <nav class="tab-nav">
    <button 
      v-for="tab in tabs"
      :key="tab.id"
      :class="['tab-button', { active: activeTab === tab.id }]"
      @click="$emit('change-tab', tab.id)"
    >
      <svg class="icon" viewBox="0 0 24 24" v-html="tab.icon"></svg>
      {{ tab.label }}
    </button>
  </nav>
</template>

<script>
export default {
  name: 'TabNavigation',
  props: {
    tabs: {
      type: Array,
      required: true
    },
    activeTab: {
      type: String,
      required: true
    }
  },
  emits: ['change-tab']
}
</script>

<style scoped>
.tab-nav {
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-primary);
  padding: 0 1rem;
  display: flex;
  overflow-x: auto;
}

.tab-nav::-webkit-scrollbar {
  display: none;
}

.tab-button {
  padding: 1rem 1.5rem;
  border: none;
  background: transparent;
  color: var(--text-tertiary);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tab-button:hover {
  color: var(--text-secondary);
}

.tab-button.active {
  color: var(--primary-500);
  border-bottom-color: var(--primary-500);
}

.icon {
  width: 16px;
  height: 16px;
  stroke: currentColor;
  stroke-width: 2;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>