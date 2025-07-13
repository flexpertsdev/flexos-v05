<template>
  <div class="vision-tab">
    <h2>Project Vision</h2>
    <div class="vision-card">
      <h3 class="project-title">E-commerce Store</h3>
      <p class="project-description">
        A modern, responsive e-commerce platform that provides seamless shopping experiences across all devices. Built with performance and user experience at its core.
      </p>
      <div class="objectives-section">
        <h4>Key Objectives</h4>
        <ul class="objectives-list">
          <li>Fast, responsive design for all devices</li>
          <li>Intuitive product discovery and search</li>
          <li>Secure and streamlined checkout process</li>
          <li>Real-time inventory management</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VisionTab',
  props: {
    isMobile: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.vision-tab h2 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.vision-card {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 1.5rem;
}

.project-title {
  color: var(--primary-500);
  margin-bottom: 1rem;
}

.project-description {
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 1.5rem;
}

.objectives-section {
  border-top: 1px solid var(--border-primary);
  padding-top: 1.5rem;
}

.objectives-section h4 {
  margin-bottom: 1rem;
}

.objectives-list {
  list-style: none;
  padding: 0;
}

.objectives-list li {
  padding: 0.5rem 0;
  color: var(--text-secondary);
  position: relative;
  padding-left: 1.5rem;
}

.objectives-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--primary-500);
}
</style>