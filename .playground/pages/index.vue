<script lang="ts" setup>
import { ref } from '#imports'

const clicked = ref(false)
</script>

<template>
  <div>
    <h1>Delayed</h1>
    <button :class="{ red: clicked }" style="padding: 30px;" @click="clicked = true">
      Big Button
    </button>
    <NuxtLink to="/not-delayed">
      not-delayed
    </NuxtLink>
    <div>
      <DelayHydration>
        <HydrationStatus />
      </DelayHydration>
    </div>
  </div>
</template>

<style>
.red {
  background-color: red;
}
</style>
