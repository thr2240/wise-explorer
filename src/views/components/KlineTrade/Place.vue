<template>
  <div>
    <b-tabs
      v-model="tabIndex"
      small
      class="nav-fill"
      pills
      :nav-class="tabIndex === 0 ? 'nav-pill-primary' : 'nav-pill-warning'"
    >
      <b-tab
        title="Buy"
        no-body
      />
      <b-tab
        title="Sell"
        no-body
      />
    </b-tabs>
    <PlaceForm
      :type="tabIndex"
      :pool="pool"
      :denom-trace="denomTrace"
    />
  </div>
</template>

<script>
import {
  BTabs, BTab,
} from 'bootstrap-vue'
import PlaceForm from './PlaceForm.vue'

export default {
  components: {
    BTab,
    BTabs,
    PlaceForm,
  },
  props: {
    pool: {
      type: Object,
      default: () => {},
    },
    denomTrace: {
      type: [Array, Object],
      default: () => [],
    },
  },
  data: () => ({
    tabIndex: 0,
  }),
}
</script>

<style lang="scss" scoped>

</style>
