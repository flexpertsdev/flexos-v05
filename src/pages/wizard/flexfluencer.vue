<template>
  <WizardLayout :progress="progress" :active-tab="activeTab" @tab-change="activeTab = $event">
    <template #chat>
      <FlexfluencerChat 
        @phase-change="currentPhase = $event"
        @progress-update="progress = $event"
      />
    </template>
    
    <template #magic>
      <FlexfluencerMagic 
        :current-phase="currentPhase"
      />
    </template>
  </WizardLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import WizardLayout from '@/components/wizard/WizardLayout.vue'
import FlexfluencerChat from '@/components/wizard/flexfluencer/FlexfluencerChat.vue'
import FlexfluencerMagic from '@/components/wizard/flexfluencer/FlexfluencerMagic.vue'

const progress = ref(0)
const activeTab = ref<'chat' | 'magic'>('chat')
const currentPhase = ref('intro')
</script>