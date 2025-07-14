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

// This page handles OAuth callbacks
const router = useRouter()
const route = useRoute()
const { isAuthenticated } = useAuth()

onMounted(async () => {
  // Wait a bit for auth state to update
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Check if we have a redirect URL in the query params
  const redirectTo = route.query.redirectTo as string || '/dashboard'
  
  // Navigate to the intended destination
  await router.push(redirectTo)
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