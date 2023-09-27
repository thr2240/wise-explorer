<template>
  <b-tabs pills size="sm" style="overflow-x:hidden;" rounded lazy>
    <template #tabs-end>
      <small style="position: absolute; max-width: 95%; min-width: 95%;size: 9; text-align:right;vertical-align:center;"
        class="d-none d-md-block text-muted">
        <b-badge class="ml-2" variant="light-success">{{ validators.length }}</b-badge> of <b-badge
          variant="light-warning">{{ stakingParameters.max_validators }}</b-badge> <small
          style="font-weight: 800">&nbsp;<span class="text-success">active</span> validators</small>
      </small>
    </template>
    <b-tab lazy pill active title="Validators">
      <template #title>
        <span>Validators </span>
      </template>
      <b-card no-body border-variant="primary" style="margin: 0; padding: 0; padding-bottom: 0px; overflow-x: hidden;">
        <!--   style="min-width: 100%;background-color: rgba(0,0,0,0.15); padding: 0; padding-top: 15px; margin: 0;"> -->
        <b-card-header class="d-flex justify-content-between">
          <b-form-group>
            <b-form-radio-group id="btn-radios-1" v-model="selectedStatus" button-variant="primary" buttons size="sm"
              name="radios-btn-default" @change="getValidatorListByStatus">
              <b-form-radio value="active" style="color: primary;">
                <span>Active<b-badge pill variant="light" class="ml-1 text-primary" size="9"
                    style="opacity:0.9; border-top: 1px solid rgba(0,0,0,0.75); box-shadow: 0px 1px 0px rgba(255,255,255,0.55);">
                    {{validators.length }}</b-badge></span>

              </b-form-radio>
              <b-form-radio value="inactive">
                <span v-if="isInactiveLoaded">Inactive
                  <b-badge pill variant="light" class="ml-1 text-primary" size="9"
                    style="opacity:0.9; border-top: 1px solid rgba(0,0,0,0.75); box-shadow: 0px 1px 0px rgba(255,255,255,0.55);">
                    {{inactiveValidators.length }}</b-badge>
                </span>
                <span class="pt-1" v-else>Inactive</span>

              </b-form-radio>

            </b-form-radio-group>
          </b-form-group>
          <small class="d-none d-md-block"
            style="position: absolute; padding-right: 25px; min-width: 100%;size: 9; text-align:right;vertical-align:center;">
            <b-badge variant="danger">
              &nbsp;
            </b-badge>
            Top 16%&nbsp;&nbsp;
            <b-badge variant="warning">
              &nbsp;
            </b-badge>
            Top 33%&nbsp;&nbsp;
            <b-badge variant="success">
              &nbsp;
            </b-badge>
            Top 50%&nbsp;&nbsp;
            <b-badge variant="info">
              &nbsp;
            </b-badge>
            Top 66%&nbsp;&nbsp;
            <b-badge variant="primary">
              &nbsp;
            </b-badge>
            Top 100%&nbsp;&nbsp;
          </small>
        </b-card-header>
        <!-- </template> -->
        <!-- <template #tabs-start> -->
        <!--   <span -->
        <!--   > -->
        <!--     &nbsp;&nbsp;&nbsp;&nbsp; -->
        <!--   </span> -->
        <!--   </template> -->

        <!-- <b-tab -->
        <!-- no-body -->
        <!--   active -->
        <!--   lazy -->
        <!--   title="Active" -->
        <!-- > -->
        <template #title>
        </template>
        <b-table :items="list" borderless sticky-header :fields="validator_fields" :sort-desc="true" sort-by="tokens"
          foot-variant="light" head-variant='light' caption-top striped responsive show-empty stacked="md">
          <!-- A virtual column -->
          <template #cell(index)="data">
            <b-badge :variant="`${rankBadge(data)}`">
              {{ data.index + 1 }}
            </b-badge>
          </template>
          <!-- Column: Validator -->
          <template #cell(description)="data">
            <b-media vertical-align="center" class="text-truncate" style="max-width:320px;">
              <template #aside>
                <b-avatar v-if="data.item.avatar" v-b-tooltip.hover.v-dark
                  v-b-tooltip.hover.right="data.item.description.details" size="32" variant="light-primary"
                  :src="data.item.avatar" />
                <b-avatar variant="primary" v-if="!data.item.avatar" v-b-tooltip.hover.v-dark
                  v-b-tooltip.hover.right="data.item.description.details">
                  <!-- <feather-icon icon="ServerIcon" /> -->
                </b-avatar>
              </template>
              <span class="font-weight-bolder d-block text-nowrap">
                <router-link :to="`./validators/${data.item.operator_address}`">
                  {{ data.item.description.moniker }}
                </router-link>
              </span>
              <small class="text-muted">{{ data.item.description.website || data.item.description.identity }}</small>
            </b-media>
          </template>
          <!-- Token -->
          <template #cell(tokens)="data">
            <div v-if="data.item.tokens > 0" class="d-flex flex-column">
              <b-progress v-b-tooltip.hover
                :title="`% of top voting power holder ${tokenFormatter(maxTokens,stakingParameters.bond_denom)}`"
                v-b-tooltip.hover.v-dark :max="100" style="margin-bottom: 7px;" :variant="`${rankBadge(data)}`"
                :value="percent(data.item.tokens/maxTokens)" width="0.2rem" show-progress show-value
                :label="`${ percent(data.item.tokens/stakingPool)}%`" height="1.2rem" />
              <small class="text-muted" style="`font-color: ${rankBadge(data)}`;">{{ tokenFormatter(data.item.tokens,
              stakingParameters.bond_denom)}}
                <b-badge v-b-tooltip.hover
                  :title="`Percent of total staking pool ${tokenFormatter(stakingPool,stakingParameters.bond_denom)}`"
                  v-b-tooltip.hover.v-dark :variant="`light-${rankCol(data)}`"><small
                    style="font-size: xs;font-color: dimmed;">{{percent(data.item.tokens/stakingPool)}}%</small>
                </b-badge>

              </small>
            </div>
          </template>
          <!-- Token -->
          <template #cell(changes)="data">
            <b-media v-if="data.item.changes>0">
              <b-badge variant="light-success" class="text-success">
                <b-icon-arrow-up-right /> {{ data.item.changes }}
              </b-badge><small class="text-success"> +{{ percent(data.item.changes * 1000000 / data.item.tokens)
              }}%</small>
            </b-media>
            <small v-else-if="data.item.changes===0">-</small>
            <b-media v-else>
              <b-badge variant="light-danger" class="text-danger">
                <b-icon-arrow-down-left /> {{ data.item.changes }}
              </b-badge><small class="text-danger"> -{{ percent(data.item.changes * 1000000 / data.item.tokens)
              }}%</small>
            </b-media>
          </template>
          <template #cell(commission)="data">
            <b-badge v-b-tooltip.hover.v-dark
              v-b-tooltip.hover.bottom="`Max rate: ${percent(data.item.commission.max_rate) + '%'}, max change rate: ${percent(data.item.commission.max_change_rate) + '%'}`"
              variant="light-info">
              {{ percent(data.item.commission.rate) + '%' }}
            </b-badge>
            &nbsp;
            <div class="d-none d-xl-inline-block">
            <b-badge variant="light-warning" style="font-weight: 400; font-size: 11px;">
              +/-{{ percent(data.item.commission.max_change_rate) }}%
            </b-badge>
            &nbsp;
            <b-badge variant="light-danger" style="font-weight: 400; font-size: 11px;">
              &lt;{{ percent(data.item.commission.max_rate) }}%
            </b-badge>
            </div>
          </template>
          <template #cell(operation)="data">
            <b-button v-b-modal.operation-modal :name="data.item.operator_address" variant="primary" size="sm"
              @click="selectValidator(data.item.operator_address)">
              <feather-icon icon="PlusIcon" />
              Delegate
            </b-button>
          </template>
          <b-tfoot>
            <div class="spacing-x-2 d-none d-md-block">
              <b-badge class="ml-2" variant="light-success">{{ validators.length }}</b-badge> of <b-badge
                variant="light-warning">{{ stakingParameters.max_validators }}</b-badge> <small
                style="font-weight: 800">&nbsp;<span class="text-success">active</span> validators</small>
            </div>
          </b-tfoot>
        </b-table>
        <!-- </b-tab> -->
        <!-- <b-tab no-body lazy title="Inactive"> -->
        <!-- <b-tab no-body lazy title="Uptime"> -->
        <!-- <template #title> -->
        <!-- Uptime -->
        <!-- </template> -->

        <!-- </b-tab> -->
        <operation-modal type="Delegate" :validator-address="validator_address" />
        <div id="txevent" />
      </b-card>
      <!-- <b-row> -->
      <!-- <validator-distribution-chart></validator-distribution-chart> -->
      <!-- </b-row> -->
    </b-tab>
    <b-tab lazy small pill title="Uptime">
      <uptime></uptime>
    </b-tab>
    <b-tab lazy small pill title="Consensus">
      <consensus></consensus>
    </b-tab>

  </b-tabs>
</template>

<script>

import {
  BIconArrowUpRight, BIconArrowDownLeft,
  BThead,
  BTfoot,
  BTr,
  BTh,
  BCardText,
  BTd,
  BTbody,
  BTab,
  BTabs,
  BTable, BMedia, BAvatar, BBadge, BCard, BCardHeader, BCardTitle, VBTooltip, BCardBody, BButton, BFormRadioGroup, BFormGroup, BFormRadio,
  BProgress,
  BProgressBar,
  BCardFooter,
} from 'bootstrap-vue'
import {
  percent, StakingParameters, formatToken,
} from '@/libs/utils'
import { keybase } from '@/libs/fetch'
import OperationModal from './components/OperationModal/index.vue'
import ValidatorDistributionChart from './components/validators/ValidatorDistributionChart.vue'
import Uptime from './validators/Uptime.vue'
import Consensus from './validators/Consensus.vue'

export default {
  components: {
    BIconArrowUpRight,
    Uptime,
    Consensus,
    BIconArrowDownLeft,
    BCard,
    BTable,
    BThead,
    BTfoot,
    BTbody,
    BTr,
    BTd,
    BTh,
    BMedia,
    BAvatar,
    BBadge,
    BCardHeader,
    BCardTitle,
    BCardBody,
    BButton,
    BFormRadioGroup,
    BFormRadio,
    BFormGroup,
    BCardFooter,
    BProgress,
    BProgressBar,
    BTab,
    BTabs,
    ValidatorDistributionChart,
    OperationModal,
    BCardText,
  },
  directives: {
    'b-tooltip': VBTooltip,
  },
  data() {
    return {
      islive: true,
      validator_address: null,
      mintInflation: 0,
      stakingPool: 1,
      maxTokens: 0,
      stakingParameters: new StakingParameters(),
      validators: [],
      delegations: [],
      changes: {},
      latestPower: {},
      previousPower: {},
      excelCols: {
        Validator: 'description.moniker',
        Identity: 'description.identity',
        Website: 'description.website',
        'Operator Address': 'operator_address',
        Status: 'status',
        'Bonded Tokens': 'tokens',
        'Formated Bonded Tokens': {
          field: 'tokens',
          callback: value => this.tokenFormatter(value, this.stakingParameters.bond_denom),
        },
        Percent: {
          field: 'tokens',
          callback: value => this.percent(value / this.stakingPool),
        },
        'Changes (24h)': 'changes',
        'Unbonding Height': 'unbonding_height',
        'Unbonding Time': 'unbonding_time',
      },
      validator_fields: [
        {
          key: 'index',
          label: 'Rank',
          tdClass: 'd-none d-md-block',
          sortable: true,
          thClass: 'd-none d-md-block',
        },
        { key: 'description', label: 'Validator' },
        {
          key: 'tokens',
          label: 'Voting Power',
          sortable: true,
          tdClass: 'text-right',
          thClass: 'text-right',
          sortByFormatted: true,
        },
        {
          key: 'changes',
          tdClass: 'text-left',
          sortable: true,
          label: 'Changes (24h)',
        },
        {
          key: 'commission',
          formatter: value => `${percent(value.rate)}%`,
          tdClass: 'text-right',
          sortable: true,
          thClass: 'text-right',
        },
        {
          key: 'operation',
          label: '',
          tdClass: 'text-right',
          thClass: 'text-right',
        },
      ],
      statusOptions: [
        { html: '<span>Active<small class=""></small></span>', value: 'active' },
        { html: '<span>Inactive<small class=""></small></span>', value: 'inactive' },
      ],
      selectedStatus: 'active',
      isInactiveLoaded: false,
      inactiveValidators: [],
    }
  },
  computed: {
    list() {
      const tab = this.selectedStatus === 'inactive' ? this.inactiveValidators : this.validators
      return tab.map(x => {
        const xh = x
        if (Object.keys(this.latestPower).length > 0 && Object.keys(this.previousPower).length > 0) {
          const latest = this.latestPower[x.consensus_pubkey.key] || 0
          const previous = this.previousPower[x.consensus_pubkey.key] || 0
          xh.changes = latest - previous
        }
        return xh
      })
    },
  },
  created() {
    this.$http.getStakingPool().then(pool => {
      this.stakingPool = pool.bondedToken
    })
    // set
    this.$http.getStakingParameters().then(res => {
      this.stakingParameters = res
    })
    this.initial()
  },
  beforeDestroy() {
    this.islive = false
  },
  mounted() {
    const elem = document.getElementById('txevent')
    elem.addEventListener('txcompleted', () => {
      this.initial()
    })
  },
  methods: {
    initial() {
      this.$http.getValidatorList().then(res => {
        const identities = []
        const temp = res
        for (let i = 0; i < temp.length; i += 1) {
          const { identity } = temp[i].description
          const url = this.$store.getters['chains/getAvatarById'](identity)
          if (url) {
            temp[i].avatar = url
          } else if (identity && identity !== '') {
            identities.push(identity)
          }
          if (temp[i].tokens > this.maxTokens) {
            this.maxTokens = temp[i].tokens
          }
        }

        // fetch avatar from keybase
        let promise = Promise.resolve()
        identities.forEach(item => {
          promise = promise.then(() => new Promise(resolve => {
            this.avatar(item, resolve)
          }))
        })
        this.validators = temp
        this.getPreviousPower(this.validators.length)
      })
    },
    getPreviousPower(length) {
      this.$http.getValidatorListByHeight('latest', 0).then(data => {
        let height = Number(data.block_height)
        if (height > 14400) {
          height -= 14400
        } else {
          height = 1
        }
        data.validators.forEach(x => {
          this.$set(this.latestPower, x.pub_key.key, Number(x.voting_power))
        })
        for (let offset = 100; offset < length; offset += 100) {
          this.$http.getValidatorListByHeight('latest', offset).then(latest => {
            latest.validators.forEach(x => {
              this.$set(this.latestPower, x.pub_key.key, Number(x.voting_power))
            })
          })
        }
        for (let offset = 0; offset < length; offset += 100) {
          this.$http.getValidatorListByHeight(height, offset).then(previous => {
            previous.validators.forEach(x => {
              this.$set(this.previousPower, x.pub_key.key, Number(x.voting_power))
            })
          })
        }
      })
    },
    getValidatorListByStatus() {
      if (this.isInactiveLoaded) return
      const statusList = ['BOND_STATUS_UNBONDED', 'BOND_STATUS_UNBONDING']
      statusList.forEach(status => {
        this.$http.getValidatorListByStatus(status).then(res => {
          const identities = []
          const temp = res
          for (let i = 0; i < temp.length; i += 1) {
            const { identity } = temp[i].description
            const url = this.$store.getters['chains/getAvatarById'](identity)
            if (url) {
              temp[i].avatar = url
            } else if (identity && identity !== '') {
              identities.push(identity)
            }
          }

          // fetch avatar from keybase
          let promise = Promise.resolve()
          identities.forEach(item => {
            promise = promise.then(() => new Promise(resolve => {
              this.avatar(item, resolve)
            }))
          })
          this.inactiveValidators = this.inactiveValidators.concat(res)
        })
      })
      this.isInactiveLoaded = true
    },
    selectValidator(da) {
      this.validator_address = da
    },
    percent,
    tokenFormatter(amount, denom) {
      return formatToken({ amount, denom }, {}, 0)
    },
    rankCol(data) {
      const { index, item } = data
      const rank = item.tokens / this.maxTokens
      if (rank >= 0.83) {
        return 'danger'
      }
      if (rank >= 0.66) {
        return 'warning'
      }
      if (rank >= 0.50) {
        return 'success'
      }
      if (rank >= 0.33) {
        return 'secondary'
      }
      if (rank >= 0.16) {
        return 'info'
      }
      return 'primary'
    },
    rankBadge(data) {
      if (this.selectedStatus === 'inactive') return 'light-primary'
      const { index, item } = data
      if (index === 0) {
        window.sum = 0
        // window.sum = item.tokens
      // } else {
        // window.sum += item.tokens
      }
      const rank = window.sum / this.stakingPool
      window.sum += item.tokens
      if (rank <= 0.16) {
        return 'danger'
      }
      if (rank <= 0.33) {
        return 'warning'
      }
      if (rank <= 0.50) {
        return 'success'
      }
      if (rank <= 0.66) {
        return 'secondary'
      }
      if (rank <= 0.83) {
        return 'info'
      }
      return 'primary'
    },
    avatar(identity, resolve) {
      if (this.islive) {
        keybase(identity).then(d => {
          resolve()
          if (Array.isArray(d.them) && d.them.length > 0) {
            const pic = d.them[0].pictures
            if (pic) {
              const list = this.selectedStatus === 'active' ? this.validators : this.inactiveValidators
              const validator = list.find(u => u.description.identity === identity)
              this.$set(validator, 'avatar', pic.primary.url)
              this.$store.commit('cacheAvatar', { identity, url: pic.primary.url })
            }
          }
        })
      }
    },
  },
}
</script>
<style>
b-button {
  box-shadow: none;
}

.gradb {
  font-weight: 500;
  text-shadow: 1px 1px 4px 2px rgba(0, 0, 0, 0.9) !important;
  background: -webkit-linear-gradient(235deg, #9a67f0 -10%, #3Ba9DB 110%);
}

.gradt {
  font-weight: 500;
  text-shadow: 1px 1px 3px 0px rgba(0, 0, 0, 0.3);
  background: -webkit-linear-gradient(235deg, #9a67f0 20%, #3Ba9DB 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
