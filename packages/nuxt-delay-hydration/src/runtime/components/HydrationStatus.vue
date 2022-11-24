<script lang="ts" setup>
const status = ref('Not hydrated')
onMounted(() => {
  status.value = 'Hydrated'
})
</script>

<template>
  <div style="display: flex; align-items: center;">
    <div>
      {{ status }}
    </div>
    <span class="hydration-status__icon" :class="{ 'hydration-status__icon--hydrated': status === 'Hydrated', 'hydration-status__icon--not-hydrated': status !== 'Hydrated' }" />
  </div>
</template>

<style scoped>
.hydration-status__icon {
  width: 10px;
  height: 10px;
  border-radius: 100%;
  display: block;
  margin-left: 5px;
}
.hydration-status__icon--hydrated {
  background-image: linear-gradient(90deg, #22c55e, #6ee7b7);
}
.hydration-status__icon--not-hydrated {
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
