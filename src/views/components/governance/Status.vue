<template>
  <b-badge v-b-tooltip.bottom.hover v-b-tooltip.bottom.hover.v-dark :to="`./gov/${p.id}`"
    :title="`Voting started ${formatDate(p.voting_start_time)} and ended ${formatDate(p.voting_end_time)}`"
    class="ml-50" :variant="`${statusCol(p.status)[1]}`" style="font-weight: 400; font-size: 12px;">
    <feather-icon :icon="`${statusCol(p.status)[2]}`" />
    {{ statusCol(p.status)[0] }}
  </b-badge>
</template>
<script lang="js">
import FeatherIcon from '@/@core/components/feather-icon/FeatherIcon.vue'
import {
  BBadge, BTooltip, VBTooltip,
} from 'bootstrap-vue'
import dayjs from 'dayjs'

export default {
  components: {
    BBadge,
    BTooltip,
    FeatherIcon,
  },
  directives: {
    'b-tooltip': VBTooltip,
  },
  props: {
    p: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    formatDate: v => dayjs(v).format('YYYY-MM-DD HH:mm'),
    statusCol(c) {
      switch (c) {
        case 4: return ['Rejected', 'light-danger', 'XIcon']
        case 3: return ['Passed', 'light-success', 'CheckIcon']
        case 2: return ['Voting', 'light-primary', 'TrendingUpIcon']
        case 1: return ['Deposit', 'light-info', 'LayersIcon']
        default: return ['Unknown', 'light-warning', '']
      }
    },
  },
}
</script>
<style>

</style>
