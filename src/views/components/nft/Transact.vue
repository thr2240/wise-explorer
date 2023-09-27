<template>
  <div>
    <b-tabs
      v-model="tabIndex"
      small
      class="nav-fill"
      pills
      :nav-class="tabIndex === 0 ? 'nav-pill-success' : 'nav-pill-danger'"
    >
      <b-tab
        title="Mint"
        no-body
      />
      <b-tab
        title="Market"
        no-body
      />
      <b-tab
        title="Browse"
        no-body
      />
      <b-tab
        title="Send"
        no-body
      />
    </b-tabs>
  </div>
</template>

<script>
import {
  BTabs, BTab, BCard, BIcon, BBadge, BAvatar, BAvatarGroup,
  BTable,
} from 'bootstrap-vue'

export default {
  components: {
    BTab,
    BTabs,
    BAvatarGroup,
    BAvatar,
    BBadge,

    BCard,
  },
  props: {
  },
  data: () => ({
    tabIndex: 0,
  }),
}
</script>

<style lang="scss" scoped>

</style>
