<template>
  <div>
    <b-card class="border-primary">
      <b-row>
        <!-- User Info: Left col -->
        <b-col cols="21" xl="6" class="d-flex justify-content-between flex-column">
          <!-- User Avatar & Action Buttons -->
          <div class="d-flex justify-content-start">
            <b-avatar :src="validator.avatar" :variant="`light-primary`" size="104px" rounded />
            <div class="d-flex flex-column ml-1">
              <div class="mb-1">
                <h4 class="mb-0">
                  {{ validator.description.moniker }}
                </h4>
                <span class="text-muted">
                  <b-link :href="validator.description.website">
                    {{ validator.description.website }}
                  </b-link>
                </span>
              </div>
              <div class="d-flex flex-wrap">
                <b-button v-b-modal.operation-modal variant="primary" class="mr-25 mb-25">
                <feather-icon icon="PlusIcon"/>
                  Delegate
                </b-button>
              </div>
            </div>
          </div>

          <!-- User Stats -->
          <b-row cols="12" class="align-items-center mt-1">
            <b-col md="4" class="d-flex align-items-center">
              <b-avatar variant="info" rounded>
                <b-icon icon="cash" size="lg" font-scale="1.3" />
              </b-avatar>
              <div class="ml-1">
                <h5 class="mb-0">
                  {{ tokenFormatter(validator.tokens).split(' ')[0].split('.')[0] }}
                </h5>
                <small class="text-muted">{{ stakingParameters.bond_denom.toUpperCase().split('U')[1] }} bonded</small>
              </div>
            </b-col>

            <b-col md="4" class="d-flex align-items-center">
              <b-avatar variant="success" rounded>
                <b-icon icon="person-fill" size="lg" font-scale="1.3" />
              </b-avatar>
              <div class="ml-1">
                <h5 class="mb-0">
                  {{ percentFormat((parseInt(selfDelegation.balance.amount) / 1) /validator.tokens) }}%
                  <small class="text-muted">
                  {{ tokenFormatter(parseInt(selfDelegation.balance.amount) / 1) }}
                  </small>
                </h5>
                <small class="text-muted">Self Delegation</small>
              </div>
            </b-col>

            <b-col md="4" class="d-flex align-items-center">
              <b-avatar variant="warning" rounded>
                <feather-icon icon="TrendingUpIcon" size="18" />
              </b-avatar>
              <div class="ml-1">
                <h5 class="mb-0">
                  {{ apr(validator.commission.rate) }}
                </h5>
                <small class="text-muted">Annual Profit</small>
              </div>
            </b-col>
          </b-row>

          <b-row cols="12" class="align-items-center mt-1">
            <b-col md="4" class="d-flex align-items-center">
              <b-avatar variant="warning" rounded>
                <b-icon icon="wallet2" size="lg" font-scale="1.3" />
              </b-avatar>
              <div class="ml-1">
                <h5 class="mb-0">
                  {{ percentFormat(validator.tokens/stakingPool) }}%
                </h5>
                <small class="text-muted">Voting Power</small>
              </div>
            </b-col>

            <b-col md="4" class="d-flex align-items-center">
              <b-avatar variant="danger" rounded>
                <b-icon icon="people-fill" size="lg" font-scale="1.3" />
              </b-avatar>
              <div class="ml-1">
                <h5 class="mb-0">
                {{ delegationCount }}
                <small class="text-muted">{{ unbondingCount }} unbonding</small>
                </h5>
                <small class="text-muted">Delegations</small>
              </div>
            </b-col>

            <b-col md="4" class="d-flex align-items-center">
              <b-avatar variant="primary" rounded>
                <b-icon icon="lightning" size="lg" font-scale="1.3" />
              </b-avatar>
              <div class="ml-1">
                <h5 class="mb-0">
                {{ slashes.length }}
                </h5>
                <small class="text-muted">Slashes</small>
              </div>
            </b-col>
          </b-row>
        </b-col>

        <!-- Right Col: Table -->
        <b-col cols="12" xl="6">
          <table class="mt-2 mt-xl-0 w-100">
            <tr>
              <th class="pb-50">
                <b-avatar size="sm" class="mr-75 p-0" variant="light-warning" rounded>
                  <feather-icon icon="CheckIcon" />
                </b-avatar>
                <span class="font-weight-bold">Status</span>
              </th>
              <td class="pb-50 text-capitalize">
                <b-badge :variant="`${statusColor(validator.status)}`">
                  <span>{{ String(validator.status).replace('BOND_STATUS_', '') }}</span>
                </b-badge>
              </td>
            </tr>
            <tr>
              <th class="pb-50">
                <b-avatar size="sm" class="mr-75 p-0" variant="light-primary" rounded>
                  <feather-icon icon="StarIcon" />
                </b-avatar>
                <span class="font-weight-bold">Unbond Height</span>
              </th>
              <td class="pb-50 text-capitalize">
                <b-badge variant="light-primary">
                  {{ validator.unbonding_height || '-' }}
                </b-badge>
              </td>
            </tr>
            <tr>
              <th class="pb-50">
                <b-avatar size="sm" class="mr-75 p-0" variant="light-info" rounded>
                  <feather-icon icon="ClockIcon" />
                </b-avatar>
                <span class="font-weight-bold">Unbond Time</span>
              </th>
              <td class="pb-50 text-capitalize">
                <b-badge variant="light-info">
                  {{ timeFormat(validator.unbonding_time) }}
                </b-badge>
              </td>
            </tr>
            <tr>
              <th class="pb-50">
                <b-avatar size="sm" class="mr-75 p-0" variant="light-success" rounded>
                  <feather-icon icon="FlagIcon" />
                </b-avatar>
                <span class="font-weight-bold">Min Self Delegation</span>
              </th>
              <td class="pb-50">
                <b-badge variant="light-primary" class="text-uppercase">
                  {{ parseFloat(validator.min_self_delegation) }} {{ stakingParameters.bond_denom }}
                </b-badge>
              </td>
            </tr>
            <tr>
              <th class="pb-50">
                <b-avatar size="sm" class="mr-75 p-0" variant="light-warning" rounded>
                  <feather-icon icon="AlertCircleIcon" />
                </b-avatar>
                <span class="font-weight-bold">Jailed</span>
              </th>
              <td class="pb-50">
                <b-badge v-if="validator.jailed" variant="light-danger">
                  Jailed
                </b-badge>
                <b-badge v-else variant="light-success">
                  Not Jailed
                </b-badge>
              </td>
            </tr>
            <tr>
              <th>
                <b-avatar size="sm" class="mr-75 p-0" variant="light-danger" rounded>
                  <feather-icon icon="PhoneIcon" />
                </b-avatar>
                <span class="font-weight-bold">Contact</span>
              </th>
              <td>
                <b-badge variant="light-info" v-if="validator.description.security_contact">
                  {{ validator.description.security_contact}}
                </b-badge>
                <small v-else class="text-muted">
                  {{ 'No contact' }}
                </small>
              </td>
            </tr>
            <tr>
              <th class="pb-50">
                <b-avatar size="sm" class="mr-75 p-0" variant="light-primary" rounded>
                  <feather-icon icon="UserIcon" />
                </b-avatar>
                <span class="font-weight-bold">Identity</span>
              </th>
              <td class="pb-50">
                <b-badge variant="light-primary" v-if="validator.description.identity">
                  {{ validator.description.identity}}
                </b-badge>
                <small v-else class="text-muted">
                  {{ 'No Keybase identity' }}
                </small>
              </td>
            </tr>
          </table>
        </b-col>
      </b-row>

      <b-card-footer v-if="validator.description.details" class="mt-1 pl-0 pr-0">
        <small class="text-muted" style="font-weight: 800;">Details: </small>&nbsp;{{ validator.description.details ||
        '' }}
      </b-card-footer>
    </b-card>
    <!-- First Row -->
    <b-row class="match-height">
      <b-col lg="4" md="12">
        <staking-commission-component :data="validator.commission" />
      </b-col>
      <b-col lg="4" md="12">
        <staking-reward-component :data="distribution" :validator="validator.operator_address"
          :address="accountAddress" />
      </b-col>
      <b-col lg="4" md="12">
        <staking-address-component
        :hex-address="hexAddress"
        :operator-address="validator.operator_address"
        :consensus-pubkey="validator.consensus_pubkey"
        :valcons-address="valconsAddress"
        :account-address="accountAddress" />
      </b-col>
    </b-row>
    <b-row>
      <b-col md="5">
        <b-card no-body>
        <b-card-title style="padding-top: 20px; padding-left: 18px;">
        Delegators
        &nbsp;
        <b-badge v-b-tooltip.bottom.hover v-b-tooltip.bottom.hover.v-dark title="Delegation count" style="font-weight: 400" variant="light-success">
        <feather-icon icon="UserPlusIcon"/>
        {{ delegationCount }}
        </b-badge>
        &nbsp;
        <b-badge v-b-tooltip.bottom.hover v-b-tooltip.bottom.hover.v-dark title="Unbonding delegation count" style="font-weight: 400" variant="light-danger">
        <feather-icon icon="UserMinusIcon"/>
        {{ unbondingCount }}
        </b-badge>
        </b-card-title>
          <b-table :items="validatorDelegations" :fields="delegationFields" striped hover :sort-desc="true" responsive="sm" foot-variant="light"
            borderless sticky-header head-variant='light' stacked="sm">
            <template #cell(order)="data">
              <b-badge variant="light-primary" size="sm" style="font-weight: 400; font-size: 10px;">
                {{ data.value }}
              </b-badge>
            </template>
            <template #cell(delegator)="data">
              <router-link style="" class="text-truncate text-primary" :to="`../account/${data.value}`">
                {{ data.value }}
              </router-link>
            </template>
            <template #cell(balance)="data">
              <b-badge style="font-weight: 400; font-size: 10px;" variant="light-success">{{ data.value }}</b-badge> <small class="text-muted">{{ stakingParameters.bond_denom.toUpperCase().split('U')[1] }}</small>
            </template>
          </b-table>
        </b-card>
      </b-col>
      <b-col md="7">
        <b-card  no-body>
        <b-card-title style="padding-top: 20px; padding-left: 18px;">
        Transactions
        </b-card-title>
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
      </b-col>
    </b-row>
    <b-row>
    </b-row>
    <operation-modal type="Delegate" :validator-address="validator.operator_address" />
    <div id="txevent" />
  </div>
</template>

<script lang="js">
import {
  BCard, BButton, BAvatar, BRow, BCol, BTable, BCardFooter, VBTooltip, VBModal, BBadge, BPagination,
  BIcon,
  BIconPersonFill,
  BIconPeopleFill,
  BLink,
  BIconHourglass,
  BIconAward,
  BIconWallet,
  BIconWallet2,
  BIconBarChart,
  BIconLightning,
  BIconCash,
  BCardTitle,
} from 'bootstrap-vue'

import {
  percent, formatToken, StakingParameters, Validator, operatorAddressToAccount, consensusPubkeyToHexAddress, toDay, abbrMessage, abbrAddress, valoperToPrefix, pubKeyToValcons,
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
    BLink,
    BCol,
    BAvatar,
    BIconWallet2,
    BIconHourglass,
    BIconWallet,
    BIconLightning,
    BCardTitle,
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
  data() {
    return {
      commission: {
        series: [90],
        completed: 89,
        inProgress: 64,
      },
      selfDelegation: {
        balance: { amount: 0 },
      },
      delegationFields: [
        {
          key: 'order',
          label: '#',
          sortable: true,
          variant: 'primary',
        },
        {
          key: 'delegator',
          label: 'Delegator',
          sortable: true,
        },
        {
          key: 'balance',
          label: 'Balance',
          sortable: true,
        },

      ],
      latestHeight: 0,
      accountAddress: '-',
      hexAddress: '-',
      valconsAddress: '-',
      stakingPool: 0,
      mintInflation: 0,
      stakingParameters: new StakingParameters(),
      validator: new Validator(),
      address: null,
      userData: {},
      blocks: Array.from('0'.repeat(100)).map(x => [Boolean(x), Number(x)]),
      distribution: {},
      transactions: {},
      delegations: [],
      delegationCount: 0,
      unbonding: [],
      unbondingCount: 0,
      slashes: [],
    }
  },
  computed: {
    validatorDelegations() {
      if (this.delegations) {
        return this.delegations.map((x, i) => ({
          order: Number(i + 1),
          delegator: x.delegation.delegator_address,
          balance: (Number(x.balance.amount) / 1000000).toFixed(2),
        }))
      }
      return []
    },
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
    this.$http.getMintingInflation().then(res => { this.mintInflation = res })
    this.address = this.$route.params.address
    this.$http.getStakingPool().then(pool => {
      this.stakingPool = pool.bondedToken
    })
    this.$http.getStakingParameters().then(res => {
      this.stakingParameters = res
    })
    this.$http.getValidatorDelegations(this.address).then(res => {
      this.delegations = res.delegation_responses
      this.delegationCount = res.pagination.total
    })
    this.$http.getValidatorSlashs(this.address).then(res => {
      this.slashes = res.slashes
    })
    this.$http.getValidatorUnbondingDelegations(this.address).then(res => {
      this.unbonding = res.unbonding_responses
      this.unbondingCount = res.pagination.total
    })
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
      const prefix = valoperToPrefix(operAddress)
      this.accountAddress = operatorAddressToAccount(operAddress)
      this.hexAddress = consensusPubkeyToHexAddress(consensusPubkey)
      this.valconsAddress = pubKeyToValcons(consensusPubkey, prefix)
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

<style>

</style>
