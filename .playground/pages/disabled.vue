<script lang="ts" setup>
import { defineRouteRules } from '#imports'

defineRouteRules({
  delayHydration: false,
})
</script>

<template>
  <div>
    <h1>Not Delayed</h1>
    <div>
      <HydrationStatus />
    </div>
  </div>
</template>
