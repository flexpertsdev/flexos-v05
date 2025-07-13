<template>
  <div class="progress-bar">
    <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  progress?: number
}

withDefaults(defineProps<Props>(), {
  progress: 0
})
</script>

<style scoped>
.progress-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--bg-tertiary);
  z-index: 1000;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-500), var(--primary-400));
  transition: width 0.5s ease-out;
}
</style>