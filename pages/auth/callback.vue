<template>
  <div class="callback-page">
    <div class="callback-container">
      <div class="loading-spinner"></div>
      <p>Completing sign in...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// This page handles OAuth callbacks
// The Supabase module will automatically handle the auth state
// We just need to redirect once ready

const user = useSupabaseUser()
const router = useRouter()

// Watch for user state changes
watchEffect(async () => {
  // Once we have a user, redirect to dashboard
  if (user.value) {
    await navigateTo('/dashboard')
  }
})

// Set a timeout in case something goes wrong
onMounted(() => {
  setTimeout(async () => {
    // If still on this page after 5 seconds, redirect to signin
    await navigateTo('/auth/signin')
  }, 5000)
})
</script>

<style scoped>
.callback-page {
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
}

.callback-container {
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-primary);
  border-top-color: var(--primary-500);
  border-radius: 50%;
  margin: 0 auto 1rem;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.callback-container p {
  color: var(--text-secondary);
  font-size: 0.875rem;
}
</style>