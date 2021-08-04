<template>
<div>
  <h1>
    Nuxt Hydration Test
  </h1>
  <div v-for="(country, key) in countries" :key="key">
    <h2>{{ country.name.common }} {{ country.flag }}</h2>
    <h3>Capital: {{ country.capital[0] }}</h3>
    <p>Phone: {{ country.callingCodes[0] }}</p>
  </div>
</div>
</template>
<script>
const getCountries = () => import('../../payloads/countries.json').then(m => m.default || m)

export default {
  async asyncData({ payload }) {
    if (payload) {
      return payload
    }
    return {
      countries: await getCountries()
    }
  }
}
</script>
