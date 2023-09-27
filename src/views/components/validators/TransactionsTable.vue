<template>
  <b-card title="Transactions">
    <b-table :items="txs" striped hover :sort-desc="true" responsive="sm" foot-variant="light" sort-by="height"
      borderless sticky-header head-variant='light' stacked="sm">
      <template #cell(status)="data">
        <b-badge v-if="data.item.status=='0'" variant="light-success">
          Success
        </b-badge>
        <b-badge v-else variant="light-danger">
          Failed
        </b-badge>
        <b v-if="data.item.status > 0"> {{ data.item.raw_log }}</b>
      </template>
      <template #cell(height)="data">
        <b-badge variant='light-primary' :to="`../blocks/${data.item.height}`">
          {{ data.item.height }}
        </b-badge>
      </template>
      <template #cell(txhash)="data">
        <router-link :to="`../tx/${data.item.txhash}`">
          {{ formatHash(data.item.txhash) }}
        </router-link>
      </template>
      <template #cell(time)="data">
        <b-badge variant='light-info'>{{ data.item.time }}</b-badge>
      </template>
    </b-table>
    <b-pagination v-if="Number(transactions.page_total) > 1" :total-rows="transactions.total_count"
      :per-page="transactions.limit" :value="transactions.page_number" class="mt-1" @change="pageload" />
  </b-card>
</template>
<script lang="js">
import {
  BCard, BButton, BAvatar, BRow, BCol, BTable, BCardFooter, VBTooltip, VBModal, BBadge, BPagination,
  BIcon,
  BIconPersonFill,
  BIconPeopleFill,
  BIconHourglass,
  BIconAward,
  BIconWallet,
  BIconWallet2,
  BIconBarChart,
  BIconLightning,
  BIconCash,
} from 'bootstrap-vue'

import {
  percent, formatToken, StakingParameters, Validator, operatorAddressToAccount, consensusPubkeyToHexAddress, toDay, abbrMessage, abbrAddress,
} from '@/libs/utils'
import { keybase } from '@/libs/fetch'
import OperationModal from '@/views/components/OperationModal/index.vue'
import StakingAddressComponent from '../components/validators/StakingAddressComponent.vue'
import StakingCommissionComponent from '../components/validators/StakingCommissionComponent.vue'
import StakingRewardComponent from '../components/validators/StakingRewardComponent.vue'

export default {
  components: {
    BCard,
    BButton,
    BIconPeopleFill,
    BRow,
    BCol,
    BAvatar,
    BIconWallet2,
    BIconHourglass,
    BIconWallet,
    BIconLightning,
    BIconAward,
    BIconCash,
    BIconBarChart,
    BIcon,
    BIconPersonFill,
    BCardFooter,
    BBadge,
    BPagination,
    BTable,
    StakingAddressComponent,
    StakingCommissionComponent,
    StakingRewardComponent,
    OperationModal,
  },
  directives: {
    'b-modal': VBModal,
    'b-tooltip': VBTooltip,
  },
  props: {
    operatorAddress: {
      type: String,
      default: '-',
    },
  },
  data() {
    return {
      latestHeight: 0,
      accountAddress: '-',
      hexAddress: '-',
      address: null,
      blocks: Array.from('0'.repeat(100)).map(x => [Boolean(x), Number(x)]),
      transactions: {},
    }
  },
  computed: {
    txs() {
      if (this.transactions.txs) {
        return this.transactions.tx_responses.map(x => ({
          height: Number(x.height),
          status: x.code,
          txhash: x.txhash,
          msgs: abbrMessage(x.tx.body.messages),
          time: toDay(x.timestamp),
        }))
      }
      return []
    },
  },
  created() {
    this.address = this.operatorAddress
    this.initial()
  },
  mounted() {
    const elem = document.getElementById('txevent')
    elem.addEventListener('txcompleted', () => {
      this.initial()
    })
  },
  methods: {
    initial() {
      this.$http.getStakingValidator(this.address).then(data => {
        this.validator = data

        this.processAddress(data.operator_address, data.consensus_pubkey)
        this.$http.getTxsBySender(this.accountAddress).then(res => {
          this.transactions = res
        })

        const { identity } = data.description
        keybase(identity).then(d => {
          if (Array.isArray(d.them) && d.them.length > 0) {
            this.$set(this.validator, 'avatar', d.them[0].pictures.primary.url)
            this.$store.commit('cacheAvatar', { identity, url: d.them[0].pictures.primary.url })
          }
        })
      })
      this.$http.getValidatorDistribution(this.address).then(res => { this.distribution = res })
    },
    pageload(v) {
      this.$http.getTxsBySender(this.accountAddress, v).then(res => {
        this.transactions = Array(res).sort()
      })
    },
    formatHash: abbrAddress,
    timeFormat(value) {
      return toDay(value)
    },
    percentFormat(value) {
      return percent(value)
    },
    processAddress(operAddress, consensusPubkey) {
      this.accountAddress = operatorAddressToAccount(operAddress)
      this.hexAddress = consensusPubkeyToHexAddress(consensusPubkey)
      this.$http.getStakingDelegatorDelegation(this.accountAddress, operAddress).then(d => {
        this.selfDelegation = d
      })
    },
    tokenFormatter(token) {
      return formatToken({ amount: token, denom: this.stakingParameters.bond_denom })
    },
    apr(rate) {
      return `${percent((1 - rate) * this.mintInflation)} %`
    },
    fetch_status(item, lastHeight) {
      return this.$http.getBlockByHeight(item[1]).then(res => {
        if (item[1] !== lastHeight) {
          const sigs = res.block.last_commit.signatures.find(s => s.validator_address === this.hexAddress)
          const block = this.blocks.find(b => b[1] === item[1])
          if (typeof block !== 'undefined') {
            this.$set(block, 0, typeof sigs !== 'undefined')
          }
        }
      })
    },
    statusColor(st) {
      switch (st) {
        case 'BOND_STATUS_BONDED': return 'light-success'
        case 'BOND_STATUS_UNBONDED': return 'light-danger'
        case 'BOND_STATUS_UNBONDING': return 'light-warning'
        default: return ''
      }
    },
    fetch_latest() {
      this.$http.getLatestBlock().then(res => {
        const sigs = res.block.last_commit.signatures.find(s => s.validator_address === this.hexAddress)
        const block = this.blocks.find(b => b[1] === res.block.last_commit.height)
        if (typeof block === 'undefined') { // mei
          // this.$set(block, 0, typeof sigs !== 'undefined')
          if (this.blocks.length > 999) this.blocks.shift()
          this.blocks.push([typeof sigs !== 'undefined', res.block.last_commit.height])
        }
      })
    },
  },
}
</script>
