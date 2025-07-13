<template>
  <div class="project-redirect">
    <div class="loading-container">
      <div class="spinner"></div>
      <h2>Preparing your project...</h2>
      <p>Redirecting to the Project Discovery Wizard</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { onMounted } from 'vue'

const route = useRoute()
const router = useRouter()
const { user } = useAuth()

onMounted(async () => {
  // Check if user is authenticated
  if (!user.value) {
    await router.push('/auth/signin')
    return
  }

  // Get the project slug
  const slug = route.params.slug as string
  
  // For now, redirect to the project discovery wizard
  // In the future, this could check if the project exists and load it
  // or redirect to the appropriate wizard
  setTimeout(() => {
    router.push({
      path: '/wizard/project-discovery',
      query: {
        projectSlug: slug
      }
    })
  }, 1500)
})
</script>

<style scoped>
.project-redirect {
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
}

.loading-container {
  text-align: center;
  padding: 2rem;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 3px solid var(--border-primary);
  border-top-color: var(--primary-500);
  border-radius: 50%;
  margin: 0 auto 2rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

p {
  color: var(--text-secondary);
  font-size: 0.95rem;
}
</style>