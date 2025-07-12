<template>
  <div class="wizard-test-page">
    <div class="test-header">
      <h1>Wizard System Test Page</h1>
      <p>Debug and test the dynamic wizard system</p>
    </div>

    <div class="test-sections">
      <!-- API Status -->
      <section class="test-section">
        <h2>API Status</h2>
        <div class="status-grid">
          <div class="status-item">
            <span class="label">AI Service:</span>
            <span class="value" :class="aiStatus.available ? 'success' : 'warning'">
              {{ aiStatus.available ? 'Available' : 'Demo Mode' }}
            </span>
          </div>
          <div class="status-item">
            <span class="label">OpenAI Key:</span>
            <span class="value" :class="aiStatus.available ? 'success' : 'error'">
              {{ aiStatus.available ? 'Configured' : 'Not Configured' }}
            </span>
          </div>
          <div class="status-item" v-if="!aiStatus.available">
            <span class="label">Message:</span>
            <span class="value">{{ aiStatus.message }}</span>
          </div>
        </div>
      </section>

      <!-- Available Wizards -->
      <section class="test-section">
        <h2>Available Wizards</h2>
        <div v-if="wizardsLoading" class="loading">Loading wizards...</div>
        <div v-else-if="wizardsError" class="error">
          Error loading wizards: {{ wizardsError }}
        </div>
        <div v-else class="wizards-grid">
          <div 
            v-for="wizard in wizards" 
            :key="wizard.id"
            class="wizard-card"
          >
            <div class="wizard-icon">{{ wizard.icon }}</div>
            <h3>{{ wizard.name }}</h3>
            <p>{{ wizard.description }}</p>
            <div class="wizard-meta">
              <span class="meta-item">ID: {{ wizard.id }}</span>
              <span class="meta-item">Version: {{ wizard.version }}</span>
              <span class="meta-item">Phases: {{ wizard.phases.length }}</span>
            </div>
            <div class="wizard-actions">
              <NuxtLink 
                :to="`/wizard/${wizard.id}`" 
                class="action-btn primary"
              >
                Test Wizard
              </NuxtLink>
              <button 
                @click="viewConfig(wizard)"
                class="action-btn secondary"
              >
                View Config
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Environment Info -->
      <section class="test-section">
        <h2>Environment Information</h2>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">Environment:</span>
            <span class="value">{{ environment }}</span>
          </div>
          <div class="info-item">
            <span class="label">Wizards Path:</span>
            <span class="value">{{ wizardsPath }}</span>
          </div>
          <div class="info-item">
            <span class="label">API Base URL:</span>
            <span class="value">{{ apiBaseUrl }}</span>
          </div>
        </div>
      </section>

      <!-- Test Wizard Chat -->
      <section class="test-section">
        <h2>Test Wizard Chat API</h2>
        <div class="chat-test">
          <input 
            v-model="testMessage"
            type="text"
            placeholder="Enter a test message"
            class="test-input"
            @keyup.enter="testChatAPI"
          >
          <button @click="testChatAPI" class="action-btn primary">
            Test Chat API
          </button>
        </div>
        <div v-if="chatResponse" class="response-box">
          <h4>Response:</h4>
          <pre>{{ JSON.stringify(chatResponse, null, 2) }}</pre>
        </div>
      </section>
    </div>

    <!-- Config Modal -->
    <div v-if="selectedWizard" class="modal" @click="selectedWizard = null">
      <div class="modal-content" @click.stop>
        <h2>{{ selectedWizard.name }} Configuration</h2>
        <pre>{{ JSON.stringify(selectedWizard, null, 2) }}</pre>
        <button @click="selectedWizard = null" class="close-btn">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { WizardConfig } from '~/types/wizard'

// State
const aiStatus = ref({ available: false, message: '' })
const wizards = ref<WizardConfig[]>([])
const wizardsLoading = ref(true)
const wizardsError = ref('')
const selectedWizard = ref<WizardConfig | null>(null)
const testMessage = ref('')
const chatResponse = ref<any>(null)

// Environment info
const environment = ref(process.env.NODE_ENV || 'development')
const wizardsPath = ref('')
const apiBaseUrl = ref('')

// Load initial data
onMounted(async () => {
  // Get API base URL
  apiBaseUrl.value = window.location.origin + '/api'
  
  // Check AI status
  try {
    const statusResponse = await $fetch('/api/wizards/ai-status')
    aiStatus.value = statusResponse as any
  } catch (error) {
    console.error('Failed to check AI status:', error)
  }
  
  // Load wizards
  try {
    const response = await $fetch<{ success: boolean; data?: WizardConfig[]; error?: string }>('/api/wizards/list')
    if (response.success && response.data) {
      wizards.value = response.data
    } else {
      wizardsError.value = response.error || 'Unknown error'
    }
  } catch (error) {
    wizardsError.value = error instanceof Error ? error.message : 'Failed to load wizards'
  } finally {
    wizardsLoading.value = false
  }
})

// Methods
function viewConfig(wizard: WizardConfig) {
  selectedWizard.value = wizard
}

async function testChatAPI() {
  if (!testMessage.value.trim()) return
  
  try {
    const response = await $fetch('/api/wizards/chat', {
      method: 'POST',
      body: {
        wizardId: 'website-refresh',
        phaseId: 'intro',
        message: testMessage.value,
        context: {
          sessionId: 'test-session',
          previousPhases: [],
          metadata: {}
        }
      }
    })
    
    chatResponse.value = response
  } catch (error) {
    chatResponse.value = {
      error: error instanceof Error ? error.message : 'Chat API test failed'
    }
  }
}
</script>

<style scoped>
.wizard-test-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.test-header {
  text-align: center;
  margin-bottom: 3rem;
}

.test-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.test-header p {
  color: var(--text-secondary);
  font-size: 1.125rem;
}

.test-sections {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.test-section {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  padding: 2rem;
}

.test-section h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

/* Status Grid */
.status-grid {
  display: grid;
  gap: 1rem;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.label {
  font-weight: 600;
  color: var(--text-secondary);
  min-width: 120px;
}

.value {
  font-family: monospace;
}

.value.success {
  color: var(--teal-500);
}

.value.warning {
  color: var(--amber-500);
}

.value.error {
  color: var(--red-500);
}

/* Wizards Grid */
.wizards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.wizard-card {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-secondary);
  border-radius: 8px;
  padding: 1.5rem;
}

.wizard-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.wizard-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.wizard-card p {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.wizard-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.meta-item {
  font-family: monospace;
}

.wizard-actions {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  display: inline-block;
  border: none;
}

.action-btn.primary {
  background: var(--primary-500);
  color: white;
}

.action-btn.primary:hover {
  background: var(--primary-600);
}

.action-btn.secondary {
  background: var(--bg-quaternary);
  color: var(--text-primary);
  border: 1px solid var(--border-secondary);
}

.action-btn.secondary:hover {
  border-color: var(--primary-500);
  color: var(--primary-500);
}

/* Info Grid */
.info-grid {
  display: grid;
  gap: 1rem;
  font-family: monospace;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Chat Test */
.chat-test {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.test-input {
  flex: 1;
  padding: 0.75rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 6px;
  color: var(--text-primary);
  font-size: 1rem;
}

.response-box {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 6px;
  padding: 1rem;
  margin-top: 1rem;
}

.response-box h4 {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-secondary);
}

.response-box pre {
  font-size: 0.75rem;
  overflow-x: auto;
  color: var(--text-primary);
}

/* Modal */
.modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-content {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 2rem;
  max-width: 800px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-content h2 {
  margin-bottom: 1rem;
}

.modal-content pre {
  background: var(--bg-tertiary);
  padding: 1rem;
  border-radius: 6px;
  overflow-x: auto;
  font-size: 0.75rem;
}

.close-btn {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: var(--primary-500);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.close-btn:hover {
  background: var(--primary-600);
}

/* Loading and Error */
.loading,
.error {
  padding: 2rem;
  text-align: center;
  color: var(--text-secondary);
}

.error {
  color: var(--red-500);
}
</style>