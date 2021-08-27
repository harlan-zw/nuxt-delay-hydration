<template>
<div>
  This will never hydrate: <hydration-status />
</div>
</template>
<script>
export default {
  async asyncData({ payload }) {
    if (payload) {
      return payload
    }
    return {
    }
  }
}
</script>
