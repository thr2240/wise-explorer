<template>
  <b-card class="card-transaction" no-body>
    <b-card-header>
      <b-card-title>Outstanding Rewards</b-card-title>
      <feather-icon v-b-modal.WithdrawCommission icon="MoreVerticalIcon" size="18" class="cursor-pointer" />
    </b-card-header>

    <b-card-body class="overflow-auto" style="max-height:220px;">
      <div v-for="d in data.self_bond_rewards" :key="d.amount" class="transaction-item">
        <b-media v-b-tooltip.hover.top title="Rewards of all delegators" no-body>
          <b-media-aside>
            <b-avatar rounded size="36" variant="light-success" text="Re" title="Rewards" />
          </b-media-aside>
          <b-media-body>
            <h6 style="font-weight: 700" class="transaction-title text-success">
              {{ formatDenom(d) }}
            </h6>
            <small class="text-muted">{{ formatNumber(d.amount) }}</small>
          </b-media-body>
        </b-media>
        <b-badge variant="light-success" class="d-none d-xl-block ">
          Reward
        </b-badge>
      </div>
      <div v-for="d in data.val_commission" :key="d.amount" class="transaction-item">
        <b-media no-body>
          <b-media-aside>
            <b-avatar rounded size="36" variant="light-primary" text="Co" title="Commission" />
          </b-media-aside>
          <b-media-body>
            <h6 style="font-weight: 700" class="text-info transaction-title">
              {{ formatDenom(d) }}
            </h6>
            <small class="text-muted">{{ formatNumber(d.amount) }}</small>
          </b-media-body>
        </b-media>
        <b-badge variant='light-info' class="d-none d-xl-block">
          Commission
        </b-badge>
      </div>
    </b-card-body>
    <b-card-body class="pt-0">
      <b-button v-b-modal.WithdrawCommission block size="sm" class="gradb text-white font-weight-bold" variant="link">
        Withdraw Commission
      </b-button>
    </b-card-body>
    <operation-modal type="WithdrawCommission" modal-id="WithdrawCommission" :address="address"
      :validator-address="validator" />
  </b-card>
</template>

<script>
import {
  BCard, BCardHeader, BCardTitle, BCardBody, BMediaBody, BMedia, BMediaAside, BAvatar, BButton, VBTooltip,
  BBadge,
} from 'bootstrap-vue'
import { formatToken, numberWithCommas } from '@/libs/utils'
import OperationModal from '@/views/components/OperationModal/index.vue'

export default {
  components: {
    BButton,
    BCard,
    BCardHeader,
    BCardTitle,
    BCardBody,
    BMediaBody,
    BBadge,
    BMedia,
    BMediaAside,
    BAvatar,
    OperationModal,
  },
  directives: {
    'b-tooltip': VBTooltip,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
    validator: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
    }
  },
  computed: {
    denoms() {
      return this.$store.state.chains.denoms
    },
  },
  methods: {
    formatNumber(value) {
      if (value < 1) return value
      if (value.indexOf('.') > 0) {
        // eslint-disable-next-line no-undef
        return numberWithCommas(BigInt(value.substring(0, value.indexOf('.'))))
      }
      // eslint-disable-next-line no-undef
      return numberWithCommas(BigInt(Number(value).toFixed(0)))
    },
    formatDenom(value) {
      return formatToken(value, this.denoms, 2)
    },
  },
}
</script>
