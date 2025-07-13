<template>
  <div class="vision-panel">
    <h2 class="panel-heading">Vision</h2>
    <div class="panel-content">
      <p class="placeholder-text">Define your project's vision and goals</p>
      <div class="placeholder-box">
        <span>Project vision content will be displayed here</span>
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
.vision-panel {
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
  margin-bottom: 1rem;
}

.placeholder-box {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 0.5rem;
  padding: 2rem;
  text-align: center;
  color: var(--text-tertiary);
}
</style>