<template>
  <div>
    <b-card>
      <b-row>
        <b-col>
          <b-input-group>
            <b-input-group-prepend>
              <b-button variant="outline-primary" disabled>
                <feather-icon icon="LinkIcon" />
              </b-button>
            </b-input-group-prepend>
            <b-form-input v-model="rpc" placeholder="Button on both side" />
            <b-input-group-append>
              <b-button variant="primary" @click="onchange()">
                Monitor Consensus
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </b-col>
      </b-row>
      <div v-if="httpstatus !== 200" class="text-danger">
        {{ httpstatus }}: {{ httpStatusText }}
      </div>
    </b-card>
    <b-row v-if="roundState['height/round/step']">
      <b-col lg="3" sm="6">
        <dashboard-card-horizontal icon="ArrowUpCircleIcon" color="primary" :statistic="rate"
          statistic-title="Onboard Rate" />
      </b-col>
      <b-col lg="3" sm="6">
        <dashboard-card-horizontal icon="BoxIcon" color="success" :statistic="height" statistic-title="Height" />
      </b-col>
      <b-col lg="3" sm="6">
        <dashboard-card-horizontal icon="RepeatIcon" :statistic="round" statistic-title="Round" />
      </b-col>
      <b-col lg="3" sm="6">
        <dashboard-card-horizontal icon="CodeIcon" color="info" :statistic="step" statistic-title="Step" />
      </b-col>
    </b-row>
    <b-card border-variant="primary" v-if="roundState['height/round/step']">
      <b-card-title class="d-flex justify-content-between">
        <div class="d-flex">
          <b-badge v-b-tooltip.bottom.hover v-b-tooltip.bottom.hover.v-dark title="Click to update" variant="primary"
            style="font-size: 14.5px; cursor: pointer; font-weight: 400;" @click="update()" size="md">
            <feather-icon size="28" icon="RefreshCwIcon" />
          </b-badge>
          &nbsp;
          <b-badge v-b-tooltip.bottom.hover v-b-tooltip.bottom.hover.v-dark title="Height" variant="light-warning"
            style="font-size: 12.5px; cursor: pointer; font-weight: 400;" @click="update()" size="md">
            <feather-icon size="28" icon="BoxIcon" />
            {{ height }}
          </b-badge>
          &nbsp;
          <b-badge v-b-tooltip.bottom.hover v-b-tooltip.bottom.hover.v-dark title="Round" variant="light-success"
            style="font-size: 12.5px; cursor: pointer; font-weight: 400;" @click="update()" size="md">
            <feather-icon size="28" icon="RepeatIcon" />
            {{ round }}
          </b-badge>
          &nbsp;
          <b-badge v-b-tooltip.bottom.hover v-b-tooltip.bottom.hover.v-dark title="Step" variant="light-info"
            style="font-size: 12.5px; font-weight: 400; cursor: pointer;" @click="update()" size="md">
            <feather-icon size="28" icon="CodeIcon" />
            {{ step }}
          </b-badge>
          &nbsp;
          <b-badge v-b-tooltip.bottom.hover v-b-tooltip.bottom.hover.v-dark title="Onboard Rate" variant="light-info"
            style="font-size: 12.5px; font-weight: 400;" @click="update()" size="md">
            <feather-icon size="28" icon="ArrowUpCircleIcon" />
            {{ rate }}
          </b-badge>
          &nbsp;
          <b-badge v-b-tooltip.bottom.hover v-b-tooltip.bottom.hover.v-dark title="Timer" variant="dark"
            style="font-size: 12.5px; opacity: 0.5; font-weight: 400;" @click="update()" size="md">
            <feather-icon size="28" icon="ClockIcon" />
            {{ timer }}
          </b-badge>
          &nbsp;
        </div>
        <small class="text-muted">
          <feather-icon size="10" icon="LinkIcon" />
          {{ rpc }}
        </small>
        <div class="d-flex">
          <b-badge v-b-tooltip.bottom.hover v-b-tooltip.bottom.hover.v-dark title="Click to update"
            variant="light-danger" style="font-size: 10.5px; cursor: pointer;" @click="update()">
            <feather-icon size="12" icon="ClockIcon" />&nbsp;
            Round start {{ format(roundState['start_time']) }}
          </b-badge>
          &nbsp;
          <b-badge v-b-tooltip.bottom.hover v-b-tooltip.bottom.hover.v-dark title="Click to update"
            variant="light-warning" style="font-size: 10.5px; cursor: pointer;" @click="update()">
            <feather-icon size="12" icon="ClockIcon" />&nbsp;
            Updated at {{ format(updatetime) }}
          </b-badge>
        </div>
      </b-card-title>
      <div v-for="item in roundState.height_vote_set" :key="item.round">
        <b-card-body>
          <b-card class="px-auto" style="border: none;">
            <b-row>
              <b-col md="2"></b-col>
              <b-col md="6">
                <b-simple-table striped hover borderless class="mx-auto"
                  style="border-top-left-radius: 7px; border-top-right-radius: 7px; background: rgba(0,0,0,0.1); border: 1px solid rgba(255,255,255,0.1); padding: 10px;">
                  <b-tr>
                    <b-th>
                      <b-badge variant="light-primary" size="sm">Round {{ round }}</b-badge>
                    </b-th>
                    <b-th>
                      <b-badge variant="light-warning">Voting State</b-badge>
                    </b-th>
                    <b-th>
                      <b-badge variant="light-warning">Voting Power</b-badge>
                    </b-th>
                  </b-tr>
                  <b-tbody style="background: rgba(0,0,0,0.05); border: 1px solid rgba(255,255,255,0.1);">
                    <b-tr>
                      <b-td>&nbsp;</b-td>
                    </b-tr>
                    <b-tr>
                      <b-td>
                        <b-badge variant="light-info">Prevotes</b-badge>
                      </b-td>
                      <b-td>
                        <small class="text-muted">
                          &nbsp;&nbsp;{{
                          String(String(item.prevotes_bit_array.split(':')[1].split('}')[0]).replaceAll('x',
                          '●')).replaceAll('_',
                          '○')
                          }}&nbsp;&nbsp;
                        </small>
                      </b-td>
                      <b-td style="margin-left: 10px;">
                        <small class="text-info">
                          {{
                          item.prevotes_bit_array.split('}')[1].trim()
                          }}
                        </small>
                      </b-td>
                    </b-tr>
                    <b-tr>
                      <b-td>
                        <b-badge variant="light-primary">Precommits</b-badge>
                      </b-td>
                      <b-td>
                        <small class="d-block text-muted">
                          &nbsp;&nbsp;{{
                          String(String(item.precommits_bit_array.split(':')[1].split('}')[0]).replaceAll('x',
                          '●')).replaceAll('_',
                          '○')
                          }}&nbsp;&nbsp;
                        </small>
                      </b-td>
                      <b-td style="margin-left: 10px;">
                        <small class="text-primary">
                          {{
                          item.precommits_bit_array.split('}')[1].trim()
                          }}
                        </small>
                      </b-td>
                    </b-tr>
                  </b-tbody>
                </b-simple-table>
              </b-col>
            </b-row>
          </b-card>
          <!-- <h4 class="font-size-lg mb-1">Validators <b-badge variant="light-info">{{ vals.length }}</b-badge></h4> -->
          <!-- <b-badge -->

          <!--  v-for="(bit, v) in item.prevotes_bit_array.slice(item.prevotes_bit_array.indexOf('_'), item.prevotes_bit_array.indexOf('}') - 1)" -->
          <!--  id="v" -->
          <!--  :key="v" -->
          <!--  class="padding-0 font-size-xs" -->
          <!--   size="sm" -->
          <!--  :variant="bitColor(bit)" -->
          <!--  > -->
          <!--  <small class="font-size-xs px-0 py-0">{{ v }}</small> -->
          <!--  </b-badge> -->
          <!-- <div class="flex-col"> -->
          <!-- <small style="color: dimmed">Prevote bit array</small> -->
          <!-- <b-badge variant="light-warning"> -->
          <!-- {{ item.prevotes_bit_array}} -->
          <!-- </b-badge> -->
          <!-- </div> -->

          <b-row cols="2" cols-sm="3" cols-md="4" cols-lg="6">
            <b-col v-for="(pre, i) in item.prevotes" :key="i">
              <small class="text-muted" style="font-size: 9px;">{{ i + 1 }}.</small>
              <b-badge v-b-tooltip.bottom.hover v-b-tooltip.bottom.hover.v-dark style="font-weight: 400; margin: 2px;"
                :title="`${showName(i, pre).operator_address}: ${pre}`"
                :to="`./validators/${showName(i, pre).operator_address}`" :variant="`${color(i, pre)}`">
                <small style="font-size: 10px; font-weight: 400;">
                  <feather-icon icon="UserIcon" />
                  {{ showName(i, pre).description.moniker }}
                </small>
              </b-badge>
            </b-col>
          </b-row>
          <div
            style="margin-top: 25px; padding-bottom: 25px; border-bottom: 1px solid rgba(255,255,255,0.11); font-size: 11px; color: muted;"
            class="spacing-x-4">
            <b-badge size="sm" variant="success" @click="onchange()">
              Va
            </b-badge>
            Proposer Signed&nbsp;&nbsp;
            <b-badge size="sm" variant="light-success" @click="onchange()">
              Va
            </b-badge>
            Proposer Not Signed&nbsp;&nbsp;
            <b-badge size="sm" variant="primary" @click="onchange()">
              Va
            </b-badge>
            Signed&nbsp;&nbsp;
            <b-badge size="sm" variant="light-primary" @click="onchange()">
              Va
            </b-badge>
            Not Signed&nbsp;&nbsp;
          </div>
        </b-card-body>
      </div>
    </b-card>
  </div>

</template>

<script>
import {
  VBTooltip,
  BSimpleTable,
  BAvatar, BCardFooter, BRow, BCol, BCardTitle, BBadge,
  BCard, BCardBody, BInputGroup, BFormInput, BInputGroupAppend, BButton,
  BCardText,
  BTd, BTr, BTh,
  BTbody,
  BInputGroupPrepend,
} from 'bootstrap-vue'
import {
  consensusPubkeyToHexAddress, getLocalChains, getCachedValidators, toDay,
} from '@/libs/utils'
import DashboardCardHorizontal from '../components/dashboard/DashboardCardHorizontal.vue'

export default {
  components: {
    BBadge,
    BRow,
    BCol,
    BTbody,
    BCard,

    BSimpleTable,
    BCardBody,
    BInputGroupPrepend,
    BCardText,
    BCardFooter,
    BTh,
    BTd,
    BTr,
    BInputGroup,
    BFormInput,
    BInputGroupAppend,
    BButton,
    BAvatar,
    BCardTitle,
    DashboardCardHorizontal,
  },
  directives: {
    'b-tooltip': VBTooltip,
  },

  data() {
    const chains = getLocalChains()
    return {
      showPrevote: true,
      httpstatus: 200,
      httpStatusText: '',
      roundState: {},
      chains,
      vals: [],
      positions: [],
      updatetime: new Date(),
      rpc: '',
      height: '-',
      round: '-',
      step: '-',
      rate: '-',
    }
  },
  computed: {
    selected() {
      return this.$store.state.chains.selected.chain_name
    },
  },
  created() {
    this.validators()
    this.rpc = `${this.chains[this.selected].rpc[0]}/consensus_state`
    this.fetchPosition()
    this.update()
    this.timer = setInterval(this.update, 6000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    format: v => toDay(v, 'time'),
    color(i, txt) {
      if (i === this.roundState.proposer.index) {
        return txt === 'nil-Vote' ? 'light-success' : 'success'
      }
      return txt === 'nil-Vote' ? 'light-primary' : 'primary'
    },
    fetchPosition() {
      const dumpurl = this.rpc.replace('consensus_state', 'dump_consensus_state')
      fetch(dumpurl).then(data => {
        this.httpstatus = data.status
        this.httpStatusText = data.httpStatusText
        return data.json()
      }).then(res => {
        this.positions = res.result.round_state.validators.validators
      })
    },
    update() {
      this.rate = '0%'
      this.updatetime = new Date()
      if (this.httpstatus === 200) {
        fetch(this.rpc).then(data => {
          this.httpstatus = data.status
          this.httpStatusText = data.httpStatusText
          return data.json()
        }).then(res => {
          this.roundState = res.result.round_state
          const raw = this.roundState['height/round/step'].split('/')
          // eslint-disable-next-line prefer-destructuring
          this.height = raw[0]
          // eslint-disable-next-line prefer-destructuring
          this.round = raw[1]
          // eslint-disable-next-line prefer-destructuring
          this.step = raw[2]

          // find the highest onboard rate
          this.roundState.height_vote_set.forEach(element => {
            const rate = Number(element.prevotes_bit_array.substring(element.prevotes_bit_array.length - 4))
            if (rate > 0) {
              this.rate = `${(rate * 100).toFixed()}%`
            }
          })
        }).catch(err => {
          this.httpstatus = 500
          this.httpStatusText = err
        })
      }
    },
    bitColor(s) {
      if (s === '_') return 'light-primary'
      if (s === 'x') return 'primary'
      return 'light-warning'
    },

    validators() {
      const conf = this.chains[this.selected]
      let vals = []
      this.$http.getValidatorList(conf).then(data => {
        vals = data
      }).catch(() => {
        vals = getCachedValidators(this.selected.chain_name) || []
      }).finally(() => {
        this.vals = vals.map(x => {
          const x2 = x
          x2.hex = consensusPubkeyToHexAddress(x.consensus_pubkey)
          return x2
        })
      })
    },
    onchange() {
      this.httpstatus = 200
      this.httpStatusText = ''
      this.roundState = {}
      // this.validators()
    },
    showName(i, text) {
      if (text !== 'nil-Vote') {
        const txt = text.substring(text.indexOf(':') + 1, text.indexOf(' '))
        const sig = text.split(' ')
        const val = this.vals.find(x => x.hex.startsWith(txt))
        return `${val?.description?.moniker || txt} - ${sig[2]}`
      }
      if (this.positions[i]) {
        const val = this.vals.find(x => x.hex === this.positions[i].address)
        return val
      }
      return null
    },
  },

}
</script>
<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';

b-button,
b-badge {
  box-shadow: 0px 2px 8px 2px rgba(0, 0, 0, 0.15);
}
</style>
