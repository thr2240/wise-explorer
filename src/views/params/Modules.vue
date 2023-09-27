<template>
  <b-row>
    {{ JSON.stringify(modules) }}
  </b-row>
</template>
<script lang="js">
export default {
  components: {
  },
  data() {
    return {
      modules: {
        accounts: [],
      },
    }
  },
  methods: {

  },
}
</script>
