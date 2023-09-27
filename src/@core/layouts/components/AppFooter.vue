<template>
  <p class="clearfix mb-0">
    <span class="float-md-left d-none d-md-block d-md-inline-block mt-25">
      <!-- The -->
      <b-link class="ml-25 font-weight-bolder" href="#" target="_blank">OLLO Explorer</b-link>
    </span>

    <router-link v-ripple.400="'rgba(113, 102, 240, 0.15)'" class="float-md-right" href="https://ollostation.zone">
      Return to the station
      <span v-ripple.400="'rgba(113, 102, 240, 0.15)'" variant="outline-primary">
      </span>
    </router-link>
  </p>
</template>

<script>
import { BLink, VBPopover } from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'

export default {
  name: 'AppFooter',
  components: {
    BLink,
  },
  directives: {
    'b-popover': VBPopover,
    Ripple,
  },
}
</script>
