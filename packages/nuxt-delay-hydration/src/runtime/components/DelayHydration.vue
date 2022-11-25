<script lang="ts" setup>
import { ref } from 'vue'

const shouldHydrate = ref(process.server)
const hydrationApi = typeof window !== 'undefined' && window._$delayHydration
// async setup will wait for promises to be resolved before the render
if (!shouldHydrate.value && !!hydrationApi)
  await hydrationApi

shouldHydrate.value = true
</script>

<template>
  <slot />
</template>
