<template>
  <b-card no-body border-variant="primary">
    <b-table sticky-header caption-top :sort-desc="true" striped show-empty :items="history" :fields="fields"
      foot-variant="light" head-variant="light" responsive borderless stacked="sm">
      <template #cell(chain)="data">
        <b-avatar size="sm" :src="data.item.chain.logo" /> {{ data.item.chain.chain_name }}
      </template>
      <template #cell(hash)="data">
        <router-link :to="`/${data.item.chain.chain_name}/tx/${data.value}`">
          {{ data.value }}
        </router-link>
      </template>
    </b-table>
    <div class="text-center">
      <b-button variant="primary" @click="clear()">
        <feather-icon icon="MinusIcon" />
        Clear History
      </b-button>
      <br />
    </div>
  </b-card>
</template>

<script>
import {
  VBTooltip, BTable, BAvatar, BButton,
  BCard,
} from 'bootstrap-vue'
import { getLocalTxHistory } from '@/libs/utils'

export default {
  components: {
    BTable,
    BAvatar,
    BButton,
    BCard,
  },
  directives: {
    'b-tooltip': VBTooltip,
  },
  data() {
    return {
      fields: [
        { key: 'chain', label: 'Chain' },
        { key: 'op', label: 'Action' },
        { key: 'hash', label: 'Tx Hash' },
        { key: 'time', sortable: true, label: 'Time' },
      ],
      history: [],
    }
  },
  created() {
    this.history = getLocalTxHistory()
  },
  methods: {
    clear() {
      this.history = []
      localStorage.setItem('txHistory', [])
    },
  },
}
</script>
