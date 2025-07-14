<template>
  <div class="code-message">
    <div class="code-header">
      <span class="language">{{ data.language || 'code' }}</span>
      <button @click="copyCode" class="copy-btn">
        <svg v-if="!copied" viewBox="0 0 24 24" class="icon">
          <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
        </svg>
        <svg v-else viewBox="0 0 24 24" class="icon">
          <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
        </svg>
        {{ copied ? 'Copied!' : 'Copy' }}
      </button>
    </div>
    <pre class="code-block"><code>{{ data.code }}</code></pre>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  data: {
    code: string
    language?: string
  }
}

const props = defineProps<Props>()
const copied = ref(false)

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(props.data.code)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
</script>

<style scoped>
.code-message {
  background: var(--bg-secondary);
  border-radius: 8px;
  overflow: hidden;
  margin: 0.5rem 0;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background: var(--bg-tertiary);
  border-bottom: 1px solid var(--border-primary);
}

.language {
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-transform: uppercase;
}

.copy-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 0.75rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: all 0.2s;
}

.copy-btn:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.icon {
  width: 14px;
  height: 14px;
  fill: currentColor;
}

.code-block {
  padding: 1rem;
  margin: 0;
  overflow-x: auto;
}

.code-block code {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--text-primary);
}
</style>