<script>
const getPokedex = () => import('../../pokedex.json').then(m => m.default || m)

export default {
  async asyncData({ payload, params }) {
    if (payload)
      return payload

    const pokemons = await getPokedex()
    return {
      pokemon: pokemons.find(p => Number.parseInt(p.id) === Number.parseInt(params.id)),
      pokemons,
    }
  },
}
</script>

<template>
  <div class="mx-auto container">
    <div class="mx-10">
      <div class="bg-green-50 rounded p-5 w-500px max-w-full mx-auto text-center mb-10">
        <h1 class="text-5xl text-white mb-3 text-green-900">
          {{ pokemon.name.english }}
        </h1>
        <img :src="`/thumbnails/${pokemon.id.toString().padStart(3, '0')}.webp`" width="100" height="100" class="mb-2 mx-auto">
        <div class="mb-3">
          <span v-for="(type, key) in pokemon.type" :key="key" class="bg-pink-500 rounded-full px-2 py-1 text-white mx-1">
            {{ type }}
          </span>
        </div>
        <div v-for="(type, key) in pokemon.base" :key="key">
          {{ key }}: {{ type }}
        </div>
      </div>

      <h2 class="mb-3 text-blue-900 text-xl">
        Other Pokemon
      </h2>
      <div class="grid grid-cols-2 sm:grid-cols-10 gap-8 w-full">
        <nuxt-link v-for="(p, key) in pokemons" v-if="key < 21 && p.id !== pokemon.id" :key="key" :to="`/pokemon/${p.id}`" class="bg-white rounded p-3 flex items-center justify-center flex-col">
          <img :src="`/thumbnails/${p.id.toString().padStart(3, '0')}.webp`" width="50" height="50" class="mb-2">
          <h2 class="text-gray-800">
            {{ p.name.english }}
          </h2>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>
