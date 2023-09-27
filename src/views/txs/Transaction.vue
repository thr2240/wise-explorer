<template>
  <div>
    <b-alert :show="error !== null" variant="danger">
      <h4 class="alert-heading">
        Error:
      </h4>
      <div class="alert-body">
        <span>Tx not found on chain. {{ error }}</span>
      </div>
    </b-alert>
    <b-card v-if="error===null" title="Overview" class="text-truncate">
      <object-field-component v-if="!tx.std" :tablefield="tx.raw" />
      <b-table-simple v-else borderless responsive hover striped stacked="sm">
        <tbody>
          <b-tr>
            <b-td style="width:200px">
              Tx Hash
            </b-td>
            <b-td class="text-truncate">{{ tx.txhash }}</b-td>
          </b-tr>
          <b-tr>
            <b-td>
              Status
            </b-td>
            <b-td class="text-wrap">
              <b-badge v-if="tx.code===0" variant="light-success">
                Success
              </b-badge>
              <b-badge v-else variant="light-danger">
                Failed
              </b-badge><b v-if="tx.code > 0"> {{ tx.raw_log }}</b>
            <!-- </b-badge> -->
            </b-td>
          </b-tr>
          <b-tr>
            <b-td>
              Height
            </b-td>
            <b-td>
              <b-badge variant="light-primary" :to="`../blocks/${tx.height}`">

                {{ tx.height }}
              </b-badge>
            </b-td>
          </b-tr>
          <b-tr>
            <b-td>
              Timestamp
            </b-td>
            <b-td>
              <b-badge variant="light-info">
                {{ formatTime(tx.timestamp) }}</b-badge>
            </b-td>
          </b-tr>
          <b-tr>
            <b-td>
              Gas
            </b-td>
            <b-td>
              <b-badge variant="light-warning">
                {{ tx.gas_used }} {{ }}
              </b-badge> of&nbsp;
              <b-badge variant="warning" style="color: black;">
                {{ tx.gas_wanted }}
              </b-badge>
              <span class="text-warning font-small-2 ml-1" style="font-size: xs;">
                {{ tx.gas_used * 100 / tx.gas_wanted }}%
              </span>
              <b-progress style="margin-top: 7px; margin-bottom: 7px; max-width: 30%;" :value="tx.gas_used"
                :max="tx.gas_wanted" show-progress show-value variant="light-warning"></b-progress>
            </b-td>
          </b-tr>
          <b-tr>
            <b-td>
              Fee
            </b-td>
            <b-td>
              <b-badge v-if="tx.tx.fee.length > 0" variant="light-danger">
                {{ tx.tx.fee? tx.tx.fee[0] : '0' }}
              </b-badge>
              <small v-else class="text-muted">No fee</small>
            </b-td>
          </b-tr>
          <b-tr>
            <b-td>
              Memo
            </b-td>
            <b-td>
              <small class="text-muted">{{ tx.tx.memo ? tx.tx.memo : "No memo added" }}</small>
            </b-td>
          </b-tr>
          <b-tr>
            <b-td>
              Timeout Height
            </b-td>
            <b-td>
              <b-badge variant="light-info">
                {{ tx.tx.timeout_height }}
              </b-badge>
            </b-td>
          </b-tr>
          <b-tr>
            <b-td>
              Raw
            </b-td>
            <b-td>
              <b-form-textarea :value="`${tx.raw_log}`" readonly rows="8" class="mt-1">
                {{ tx.raw_log }}
              </b-form-textarea>
            </b-td>
          </b-tr>
        </tbody>
      </b-table-simple>
    </b-card>

    <div v-if="tx.tx.messages">
      <b-card v-for="(item, i) in tx.tx.messages " :title="`Message ${i + 1} of ${tx.tx.messages.length}`" :key="i">
        <b-card-body id="message"
        class="message px-0"
        :key="i">
          <object-field-component :tablefield="item" />
        </b-card-body>
      </b-card>
    <b-card
      v-if="tx.element"
      title="Details"
    >
      <object-field-component :tablefield="tx.element.tx_response" />
    </b-card>
    </div>
  </div>
</template>

<script>
import {
  BCard, BTableSimple, BTr, BTd, BBadge, BCardBody, BCardTitle, BAlert, BProgress, BFormTextarea,
} from 'bootstrap-vue'
import { toDay, tokenFormatter } from '@/libs/utils'
import ObjectFieldComponent from '../components/ObjectFieldComponent.vue'

export default {
  components: {
    BAlert,
    BCard,
    BCardBody,
    BTableSimple,
    BTr,
    BProgress,
    BFormTextarea,
    BTd,
    BBadge,
    ObjectFieldComponent,
    BCardTitle,
  },
  beforeRouteUpdate(to, from, next) {
    const { hash } = to.params
    if (hash !== from.params.hash) {
      this.error = null
      this.$http.getTxs(hash).then(res => {
        this.tx = res
      }).catch(err => {
        this.error = err
      })
      next()
    }
  },
  data() {
    return {
      error: null,
      tx: { tx: {} },
    }
  },
  created() {
    const { hash } = this.$route.params
    this.$http.getTxs(hash).then(res => {
      this.error = null
      this.tx = res
    }).catch(err => {
      this.error = err
    })
  },
  methods: {
    formattoken: v => tokenFormatter(v),
    formatTime: v => toDay(v),
  },
}
</script>

<style>
#message {}
</style>
