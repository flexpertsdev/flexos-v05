<template>
  <div class="wizard-list-page">
    <!-- Header -->
    <AppHeader title="FlexOS" />
    
    <!-- Mobile Navigation -->
    <BottomSheet v-model="menuOpen" />
    
    <!-- Main Content -->
    <div class="wizard-list-container">
      <div class="header">
        <h1 class="title">
          <span class="icon">🔮</span>
          FlexOS Wizards
        </h1>
        <p class="subtitle">
          Choose a wizard to help you build something amazing
        </p>
      </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Loading wizards...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="loadWizards" class="retry-button">
        Try Again
      </button>
    </div>

    <div v-else class="wizard-grid">
      <NuxtLink
        v-for="wizard in wizards"
        :key="wizard.id"
        :to="`/wizard/${wizard.id}`"
        class="wizard-card"
      >
        <div class="wizard-icon">{{ wizard.icon }}</div>
        <h3 class="wizard-name">{{ wizard.name }}</h3>
        <p class="wizard-description">{{ wizard.description }}</p>
        <div class="wizard-meta">
          <span class="category">{{ wizard.category }}</span>
          <span class="time">~{{ wizard.settings?.estimatedTime || 10 }} min</span>
        </div>
      </NuxtLink>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useNavigation } from '~/composables/useNavigation'
import AppHeader from '~/components/layout/AppHeader.vue'
import BottomSheet from '~/components/layout/BottomSheet.vue'
import type { WizardConfig } from '~/types/wizard'

const { menuOpen } = useNavigation()

const wizards = ref<WizardConfig[]>([])
const loading = ref(true)
const error = ref('')

async function loadWizards() {
  loading.value = true
  error.value = ''
  
  try {
    const response = await $fetch<{ success: boolean; data?: WizardConfig[]; error?: string }>('/api/wizards/list')
    
    if (response.success && response.data) {
      wizards.value = response.data
    } else {
      throw new Error(response.error || 'Failed to load wizards')
    }
  } catch (err) {
    console.error('Failed to load wizards:', err)
    error.value = 'Failed to load wizards. Please try again.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadWizards()
})
</script>

<style scoped>
.wizard-list-page {
  min-height: 100vh;
  background: var(--bg-primary);
  padding-top: calc(60px + env(safe-area-inset-top, 0)); /* Account for fixed header */
}

.wizard-list-container {
  min-height: 100vh;
  background: var(--bg-primary);
  padding: 2rem;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.icon {
  font-size: 3rem;
}

.subtitle {
  font-size: 1.125rem;
  color: var(--text-secondary);
}

.loading {
  text-align: center;
  padding: 4rem;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 3px solid var(--border-primary);
  border-top-color: var(--primary-500);
  border-radius: 50%;
  margin: 0 auto 1rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error {
  text-align: center;
  padding: 4rem;
  color: #ef4444;
}

.retry-button {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: var(--primary-500);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.retry-button:hover {
  background: var(--primary-600);
  transform: translateY(-1px);
}

.wizard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.wizard-card {
  background: var(--bg-secondary);
  border: 2px solid var(--border-primary);
  border-radius: 16px;
  padding: 2rem;
  text-decoration: none;
  transition: all 0.3s;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.wizard-card:hover {
  border-color: var(--primary-500);
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
}

.wizard-icon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.wizard-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.wizard-description {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.5;
  flex: 1;
}

.wizard-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid var(--border-primary);
}

.category {
  background: var(--bg-tertiary);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-tertiary);
}

.time {
  font-size: 0.875rem;
  color: var(--text-tertiary);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .wizard-list-page {
    padding-top: calc(56px + env(safe-area-inset-top, 0)); /* Mobile header height */
  }

  .wizard-list-container {
    padding: 1rem;
  }

  .title {
    font-size: 2rem;
  }

  .wizard-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .wizard-card {
    padding: 1.5rem;
  }
}
</style>