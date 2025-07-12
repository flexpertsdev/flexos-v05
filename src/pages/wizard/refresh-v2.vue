<template>
  <WizardLayout :progress="progress" :active-tab="activeTab" @tab-change="activeTab = $event">
    <template #chat>
      <WebsiteRefreshChat 
        @phase-change="currentPhase = $event"
        @progress-update="progress = $event"
      />
    </template>
    
    <template #magic>
      <WebsiteRefreshMagic 
        :current-phase="currentPhase"
        :website-url="websiteUrl"
      />
    </template>
  </WizardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import WizardLayout from '@/components/wizard/WizardLayout.vue'
import WebsiteRefreshChat from '@/components/wizard/refresh/WebsiteRefreshChat.vue'
import WebsiteRefreshMagic from '@/components/wizard/refresh/WebsiteRefreshMagic.vue'

const route = useRoute()
const progress = ref(0)
const activeTab = ref<'chat' | 'magic'>('chat')
const currentPhase = ref('intro')
const websiteUrl = ref('')

onMounted(() => {
  // Get URL from query params if provided
  if (route.query.url) {
    websiteUrl.value = route.query.url as string
  }
})
</script>