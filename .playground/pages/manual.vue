<script lang="ts" setup>
import { defineRouteRules } from '#imports'

defineRouteRules({
  delayHydration: 'manual',
})
</script>

<template>
  <div>
    <div>
      <HydrationStatus />
    </div>
    <DelayHydration>
      <HydrationStatus />
    </DelayHydration>
  </div>
</template>
