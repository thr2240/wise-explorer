<template>
  <b-card v-if="assets" no-body style="margin-top: 20px;" border-variant="primary">
    <chart-component-doughnut v-if="chartData" :height="235" :width="235" :data="assets" class="mb-3" />
    <b-table :items="assets" :fields="cfield" hover foot-variant="light" header-variant="light" striped
      :sort-desc="true" borderless sticky-header stacked="sm" responsive>
      borderless
      stacked="sm" sticky-header="true" responsive="xs">
    </b-table>
  </b-card>
</template>

<script>
import { sha256 } from '@cosmjs/crypto'
import { toHex } from '@cosmjs/encoding'
import {
  BTable, BCardBody, BCardHeader, BCardTitle, BCard,
} from 'bootstrap-vue'
import { formatTokenAmount, formatTokenDenom } from '@/libs/utils'
import ChartComponentDoughnut from '../charts/ChartComponentDoughnut.vue'

export default {
  components: {
    BCard,
    BTable,
    BCardHeader,
    BCardBody,
    BCardTitle,
    ChartComponentDoughnut,
  },
  data() {
    return {
      islive: true,
      assets: [],
      denoms: {},
      cfield: [
        {
          key: 'denom',
          sortable: true,
          formatter: this.formatDenom,
          tdClass: 'text-nowrap text-truncate overflow-hidden',
        },
        {
          key: 'abbr',
          label: 'Amount',
          sortable: true,
        },
      ],
    }
  },
  created() {
    this.$http.getAllIBCDenoms().then(x => {
      x.denom_traces.forEach(trace => {
        const hash = toHex(sha256(new TextEncoder().encode(`${trace.path}/${trace.base_denom}`)))
        this.$set(this.denoms, `ibc/${hash.toUpperCase()}`, trace)
      })
    })
    this.$http.getBankTotals().then(res => {
      const toshow = res.sort()
      this.assets = toshow.reverse().map(x => {
        const xh = x
        xh.abbr = formatTokenAmount(x.amount, 0, x.denom)
        return xh
      })
    })
  },
  beforeDestroy() {
    this.islive = false
  },
  methods: {
    formatDenom(v) {
      if (this.denoms[v]) {
        const trace = this.denoms[v]
        return `* ${formatTokenDenom(trace.base_denom)} (${trace.path})`
      }
      return formatTokenDenom(v)
    },
  },
}
</script>

<style>

</style>
