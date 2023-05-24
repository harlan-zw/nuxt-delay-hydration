<script lang="ts" setup>
import { onMounted, ref } from 'vue'

const status = ref('Not hydrated')
onMounted(() => {
  status.value = 'Hydrated'
})
</script>

<template>
  <div class="hydration-status" :class="{ 'hydration-status--hydrated': status === 'Hydrated', 'hydration-status--not-hydrated': status !== 'Hydrated' }">
    <div>
      {{ status }}
    </div>
    <span class="hydration-status__icon" />
  </div>
</template>

<style scoped>
.hydration-status {
  display: inline-flex;
  padding: 5px 2px;
  align-items: center;
  justify-items: center;
  font-weight: bold;
  font-family: 'Roboto Mono', monospace;
}
.hydration-status__icon {
  width: 10px;
  height: 10px;
  border-radius: 100%;
  display: block;
  margin-left: 5px;
}
.hydration-status--hydrated {
  border-bottom: 2px solid #22c55e;
}
.hydration-status--not-hydrated {
  border-bottom: 2px solid #ef4444;
}
.hydration-status--hydrated .hydration-status__icon {
  background-image: linear-gradient(90deg, #22c55e, #6ee7b7);
}
.hydration-status--not-hydrated .hydration-status__icon {
  background-image: linear-gradient(90deg, #ef4444, #fdba74);
  animation: pulse 1s infinite ease-in-out alternate;
}

@keyframes pulse {
  0% {
    transform: scale(0.8);
  }
  100% {
    transform: scale(1);
  }
}
</style>
