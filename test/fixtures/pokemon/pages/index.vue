<template>
<div class="grid grid-cols-2 sm:grid-cols-10 gap-8 w-full mx-auto container">
  <nuxt-link
    v-for="(pokemon, key) in pokemons"
    :key="key"
    :to="'/pokemon/' + pokemon.id"
    class="bg-white rounded p-3 flex items-center justify-center flex-col"
  >
    <p class="text-gray-500 text-sm">#{{ pokemon.id.toString().padStart(3, '0') }}</p>
    <img :src="'/thumbnails/' + pokemon.id.toString().padStart(3, '0') + '.webp'" width="100" height="100" />
    <h2 class="text-gray-700 font-bold">{{ pokemon.name.english }}</h2>
  </nuxt-link>
</div>
</template>
<script>
const getPokedex = () => import('../pokedex.json').then(m => m.default || m)

export default {
  async asyncData({ payload }) {
    if (payload) {
      return payload
    }
    return {
      pokemons: (await getPokedex()).slice(0, 100)
    }
  }
}
</script>
