<template>
  <div class="auth-callback">
    <div class="loader-container">
      <div class="loader"></div>
      <p>Completing sign in...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

// Disable auth middleware for this page
definePageMeta({
  middleware: []
})

const router = useRouter()

onMounted(async () => {
  // Small delay to ensure auth state is updated
  setTimeout(() => {
    router.push('/dashboard')
  }, 1000)
})
</script>

<style scoped>
.auth-callback {
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
}

.loader-container {
  text-align: center;
}

.loader {
  width: 48px;
  height: 48px;
  border: 3px solid var(--bg-tertiary);
  border-top-color: var(--primary-500);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loader-container p {
  color: var(--text-secondary);
  font-size: 0.875rem;
}
</style>