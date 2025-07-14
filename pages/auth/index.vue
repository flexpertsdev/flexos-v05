<template>
  <div class="auth-redirect">
    <div class="loading">
      <div class="spinner"></div>
      <p>Redirecting...</p>
    </div>
  </div>
</template>

<script setup>
// Redirect to signin by default
const router = useRouter()
onMounted(() => {
  router.push('/auth/signin')
})
</script>

<style scoped>
.auth-redirect {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: var(--bg-primary);
}

.loading {
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto 1rem;
  border: 3px solid var(--border-primary);
  border-top-color: var(--primary-500);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
