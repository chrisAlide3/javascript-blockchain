<template>
  <div>
    <p>{{ chain }}</p>
  </div>
</template>

<script>
export default {
  computed: {
    chain () {
      return this.$store.getters.chain;
    }
  },

  data () {
    return {

    }
  }
}
</script>

