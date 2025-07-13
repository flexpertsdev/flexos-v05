<template>
  <div class="builder-page">
    <BuilderLayout />
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import { useRouter } from 'vue-router'

// Ensure user is authenticated
const { user, isAuthenticated } = useAuth()
const router = useRouter()

onMounted(() => {
  if (!isAuthenticated.value) {
    router.push('/auth/signin')
  }
})

// Set page metadata
useHead({
  title: 'FlexOS Builder - Build your app with AI',
  meta: [
    { name: 'description', content: 'Build your application using AI-powered conversations and visual tools' }
  ]
})
</script>

<style scoped>
.builder-page {
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  background: var(--bg-primary);
}
</style>