<template>
<div>
  <header >
    Vite Example <hydration-status />
  </header>
  <main class="py-15" :class="[bg]" class-hint="bg-blue-100 bg-blue-200 bg-blue-300 bg-blue-400 bg-blue-500 bg-blue-600 bg-blue-700 bg-blue-800 bg-blue-900">
    <div>
      <div class="text-center">
        <button class="bg-orange-600 text-orange-50 rounded-lg p-3" @click="bg = 'bg-blue-' + ((Math.floor(Math.random() * 6) + 1) * 100)">Change background <hydration-status /></button>
      </div>
      <div class=" mx-auto container">
        <Nuxt />
      </div>
    </div>
  </main>
</div>
</template>
<script>
export default {
  data () {
    return {
      bg: 'bg-gray-50',
    }
  }
}
</script>
