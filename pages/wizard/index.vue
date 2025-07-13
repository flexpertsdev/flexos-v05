<template>
  <div></div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

// Redirect to the wizards list page
router.push('/wizards')
</script>