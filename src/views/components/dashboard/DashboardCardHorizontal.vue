<!-- border-bottom: 1px solid rgba(255,255,255,0.15); -->
<!-- border-top: 1px solid rgba(255,255,255,0.08); -->
<!-- border-left: 1px solid rgba(255,255,255,0.08); -->
<!-- border-right: 1px solid rgba(255,255,255,0.08); -->
<!-- style="box-shadow: 0 0px 2px 0 rgba(255,255,255,0.7); -->
<template>
  <b-card no-body>
    <b-card-body class="d-flex justify-content-between align-items-center">
      <div class="truncate">
        <h4 class="mb-25 font-weight-bolder">
          {{ statistic || '-' }}
        </h4>
        <small v-if="!statistic || statistic === '-'" class="text-muted">
          {{ statisticTitle }}
        </small>
        <small v-else-if="changes === 0" class="text-muted">
          {{ showPrice(statistic, statisticTitle) }}
        </small>
        <small v-else-if="changes < 0" v-b-tooltip.hover.v-danger :title="`${changes.toFixed(1)}%`" class="text-danger">
          {{ showPrice(statistic, statisticTitle) }}
        </small>
        <b-badge variant="light-success" v-else v-b-tooltip.hover.v-success :title="`+${changes.toFixed(1)}%`"
          class="text-success">
          {{ showPrice(statistic, statisticTitle) }}
        </b-badge>
      </div>

      <b-avatar v-if="icon" class="mb-1 shadow-lg" :variant="`${color}`" size="45">
        <feather-icon size="24" :icon="icon" />
      </b-avatar>
      <b-avatar v-else v-b-tooltip.hover :variant="`light-${color}`" class="shadow-md" size="45"
        :text="statisticTitle.substring(0,2)" :title="statisticTitle" />
    </b-card-body>
  </b-card>
</template>
        <!-- :variant="`light-${color}`" -->

<script>
import {
  BCard, BCardBody, BAvatar, VBTooltip,
  BBadge,
} from 'bootstrap-vue'
import { getUserCurrency, getUserCurrencySign } from '@/libs/utils'

export default {
  components: {
    BCard,
    BCardBody,
    BAvatar,
    VBTooltip,
    BBadge,
  },
  directives: {
    'b-tooltip': VBTooltip,
  },
  props: {
    icon: {
      type: String,
      required: false,
    },
    statistic: {
      type: [Number, String],
      required: true,
    },
    statisticTitle: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: 'primary',
    },
  },
  data() {
    return {
      changes: 0,
    }
  },
  methods: {
    showPrice(v, statisticTitle) {
      const token = String(v).split(' ')
      if (token.length >= 2) {
        const quote = this.$store.state.chains.quotes[token[1]]
        if (quote) {
          const price = quote[getUserCurrency()]
          this.changes = quote[`${getUserCurrency()}_24h_change`]
          return `${getUserCurrencySign()}${(Number(token[0].replaceAll(',', '')) * price).toFixed(2)}`
        }
      }
      return statisticTitle
    },
  },
}
</script>
<style>
.stattitle {
  color: "primary";

}
</style>
