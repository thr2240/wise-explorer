<template>
  <div>
    <b-card no-body class="text-truncate">
      <b-tabs pills class="mt-1">
        <b-tab disabled>
          <template #title>
            Recent
          </template>
        </b-tab>

        <b-tab active>
          <template #title>
            Blocks
          </template>
          <b-table :items="blocks" :fields="list_fields" foot-variant="light" head-variant='light' :sort-desc="true"
            sort-by="height" striped borderless sticky-header stacked="sm" hover responsive>
            <!-- Column: Height -->
            <template #cell(height)="data">
              <router-link :to="`./blocks/${data.item.block.header.height}`">
                <b-badge variant="light-primary">
                  {{ data.item.block.header.height }}
                </b-badge>
              </router-link>
            </template>
            <template #cell(hash)="data">
              <small>{{ data.item.block_id.hash }}</small>
            </template>
            <template #cell(proposer)="data">
              <b-media vertical-align="center" class="text-truncate" style="max-width:320px;">
                <template #aside>
                  <b-avatar v-if="avatar(data.item.block.header.proposer_address)" v-b-tooltip.hover.v-dark
                    v-b-tooltip.hover.right="formatProposerV(data.item.block.header.proposer_address).description.details"
                    size="32" variant="primary" :src="avatar(data.item.block.header.proposer_address)" />
                  <b-avatar variant="primary" v-else v-b-tooltip.hover.v-dark
                    v-b-tooltip.hover.right="formatProposerV(data.item.block.header.proposer_address).description.details">
                    <!-- <feather-icon icon="ServerIcon" /> -->
                  </b-avatar>
                </template>
                <span class="font-weight-bolder font-small-3 d-block text-nowrap">
                  <router-link
                    :to="`./validators/${formatProposerV(data.item.block.header.proposer_address).operator_address}`">
                    {{ formatProposerV(data.item.block.header.proposer_address).description.moniker }}
                  </router-link>
                </span>
                <small class="text-muted">{{
                formatProposerV(data.item.block.header.proposer_address).description.website ||
                formatProposerV(data.item.block.header.proposer_address).description.identity }}</small>
              </b-media>
            </template>
            <template #cell(txs)="data">
              <b-badge v-b-tooltip :title="`Containing ${data.item.block.data.txs.length} transactions`"
                :variant="`light-${txLengthColor(data.item.block.data.txs.length)}`">
                {{ length(data.item.block.data.txs) }}
              </b-badge>
            </template>
            <template #cell(messages)="data">
              <b-badge v-for="(tx, i) in initData(data.item.block, )" variant="none" id="transaction" :key="i">
                <b-avatar-group>
                  <b-avatar v-for="(msg, j) in tx.messages" :key="j" id="message" :size="42"
                    :variant="`light-${msgColor(msg)[0]}`" :badge="`${i+1}`" badge-top badge-right badge-variant="dark"
                    v-b-tooltip :title="`${msg.typeUrl}`">

                    <b-icon-cash-stack
                      v-if="msg.typeUrl == '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/cosmos.authz.v1beta1.MsgExec'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/cosmos.authz.v1beta1.MsgRevoke'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/cosmos.authz.v1beta1.MsgGrant'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/cosmos.gov.v1beta1.MsgDeposit'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/cosmos.gov.v1beta1.MsgSubmitProposal'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/cosmos.gov.v1beta1.MsgVote'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/cosmos.gov.v1beta1.MsgVoteWeighed'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/cosmos.gov.v1.MsgDeposit'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/cosmos.gov.v1.MsgSubmitProposal'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/cosmos.gov.v1.MsgVote'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/cosmos.gov.v1.MsgVoteWeighed'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/cosmos.group.v1.MsgCreateGroup'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/cosmos.group.v1.MsgCreateGroupPolicy'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/cosmos.group.v1.MsgCreateGroupWithPolicy'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/cosmos.group.v1.MsgExec'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/cosmos.group.v1.MsgLeaveGroup'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/cosmos.group.v1.MsgSubmitProposal'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/cosmos.group.v1.MsgUpdateGroupAdmin'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/cosmos.group.v1.MsgUpdateGroupMembers'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/cosmos.group.v1.MsgUpdateGroupMetadata'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/cosmos.group.v1.MsgUpdateGroupPolicyAdmin'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/cosmos.group.v1.MsgUpdateGroupPolicyDecisionPolicy'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/cosmos.group.v1.MsgUpdateGroupPolicyMetadata'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/cosmos.group.v1.MsgVote'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/cosmos.group.v1.MsgWithdrawProposal'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/cosmos.nft.v1beta1.MsgSend'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/cosmos.slashing.v1beta1.MsgUnjail'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/cosmos.feegrant.v1beta1.MsgGrantAllowance'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/cosmos.feegrant.v1beta1.MsgRevokeAllowance'" />
                    <b-icon-person-plus v-else-if="msg.typeUrl == '/cosmos.staking.v1beta1.MsgCreateValidator'" />
                    <b-icon-person-check v-else-if="msg.typeUrl == '/cosmos.staking.v1beta1.MsgEditValidator'" />
                    <b-icon-person-check
                      v-else-if="msg.typeUrl == '/cosmos.staking.v1beta1.MsgCancelUnbondingDelegation'" />
                    <b-icon-person-check v-else-if="msg.typeUrl == '/cosmos.upgrade.v1beta1.MsgCancelUpgrade'" />
                    <b-icon-person-check v-else-if="msg.typeUrl == '/cosmos.upgrade.v1beta1.MsgSoftwareUpgrade'" />
                    <b-icon-cash-stack v-else-if="msg.typeUrl == '/cosmos.bank.v1beta1.MsgMultiSend'" />
                    <b-icon-send v-else-if="msg.typeUrl == '/cosmos.bank.v1beta1.MsgSend'" />
                    <b-icon-cash v-else-if="msg.typeUrl == '/cosmos.staking.v1beta1.MsgDelegate'" />
                    <b-icon-clipboard-data
                      v-else-if="msg.typeUrl == '/cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission'" />
                    <b-icon-clipboard-data
                      v-else-if="msg.typeUrl == '/cosmos.distribution.v1beta1.MsgFundCommunityPool'" />
                    <b-icon-clipboard-data
                      v-else-if="msg.typeUrl == '/cosmos.distribution.v1beta1.MsgSetWithdrawAddress'" />
                    <b-icon-clipboard-data v-else-if="msg.typeUrl == '/cosmos.evidence.v1beta1.MsgSubmitEvidence'" />
                    <b-icon-eject v-else-if="msg.typeUrl == '/cosmos.staking.v1beta1.MsgUndelegate'" />
                    <b-icon-file-diff v-else-if="msg.typeUrl == '/cosmos.staking.v1beta1.MsgBeginRedelegate'" />
                    <b-icon-box-arrow-up v-else-if="msg.typeUrl == '/ibc.applications.transfer.v1.MsgTransfer'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/ibc.core.channel.v1.MsgAcknowledgement'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/ibc.core.channel.v1.MsgChannelCloseConfirm'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/ibc.core.channel.v1.MsgChannelCloseInit'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/ibc.core.channel.v1.MsgChannelOpenAck'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/ibc.core.channel.v1.MsgChannelOpenConfirm'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/ibc.core.channel.v1.MsgChannelOpenInit'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/ibc.core.channel.v1.MsgChannelOpenTry'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/ibc.core.channel.v1.MsgRecvPacket'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/ibc.core.channel.v1.MsgTimeout'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/ibc.core.channel.v1.MsgTimeoutOnClose'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/ibc.core.client.v1.MsgCreateClient'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/ibc.core.client.v1.MsgSubmitMisbehaviour'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/ibc.core.client.v1.MsgUpdateClient'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/ibc.core.client.v1.MsgUpgradeClient'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/ibc.core.connection.v1.MsgConnectionOpenAck'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/ibc.core.connection.v1.MsgConnectionOpenConfirm'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/ibc.core.connection.v1.MsgConnectionOpenInit'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/ibc.core.connection.v1.MsgConnectionOpenTry'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/cosmos.vesting.v1beta1.MsgCreateVestingAccount'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/cosmos.vesting.v1beta1.MsgCreatePeriodicVestingAccount'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/cosmos.vesting.v1beta1.MsgCreatePermanentLockedAccount'" />

                    <b-icon-play v-else-if="msg.typeUrl == '/ollo.liquidity.MsgCancelAllOrders'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/ollo.liquidity.MsgCancelMarketMakingOrder'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/ollo.liquidity.MsgCancelOrder'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/ollo.liquidity.MsgCreatePair'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/ollo.liquidity.MsgCreatePoolCapped'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/ollo.liquidity.MsgCreatePool'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/ollo.liquidity.MsgDeposit'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/ollo.liquidity.MsgWithdraw'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/ollo.liquidity.MsgOrderLimit'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/ollo.liquidity.MsgOrderMarket'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/ollo.liquidity.MsgOrderMarketMaking'" />

                    <b-icon-play v-else-if="msg.typeUrl == '/ollo.claim.MsgClaim'" />

                    <b-icon-play v-else-if="msg.typeUrl == '/ollo.oracle.MsgPricesData'" />

                    <b-icon-play v-else-if="msg.typeUrl == '/ollo.ons.MsgBuyName'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/ollo.ons.MsgSetName'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/ollo.ons.MsgSellName'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/ollo.ons.MsgDeleteName'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/ollo.ons.MsgDeleteThread'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/ollo.ons.MsgAddThread'" />

                    <b-icon-play v-else-if="msg.typeUrl == '/ollo.laon.MsgRequestLoan'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/ollo.laon.MsgApproveLoan'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/ollo.laon.MsgRepayLoan'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/ollo.laon.MsgLiquidateLoan'" />
                    <b-icon-play v-else-if="msg.typeUrl == '/ollo.laon.MsgCancelLoan'" />

                    <b-icon-arrow-down v-else />
                  </b-avatar>
                </b-avatar-group>
              </b-badge>
            </template>

            <template #cell(time)="data">
              <!-- <b-badge variant='light-primary'> -->
              {{ formatTime(data.item.block.header.time) }}
              <!-- </b-badge> -->
            </template>
          </b-table>
        </b-tab>
        <b-tab title="Transactions">
          <b-table :fields="txFields" :items="txs" striped hover sticky-header :sort-desc="true" responsive="sm"
            foot-variant="light" sort-by="height" borderless head-variant='light' stacked="sm">
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
            <template #cell(hash)="data">
              <router-link :to="`./tx/${data.value}`">
                {{ shortHash(data.value) }}
              </router-link>
            </template>
          </b-table>
          <b-pagination v-if="Number(transactions.page_total) > 1" :total-rows="transactions.total_count"
            :per-page="transactions.limit" :value="transactions.page_number" class="mt-1" @change="pageload" />
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script lang="jsx">
import {
  BTable, BCard, BCardHeader, BCardTitle, VBTooltip, BTab, BTabs,
  BIconBoxArrowUp,
  BIconCashStack,
  BIconPersonPlus,
  BIconPlay,
  BIconPersonCheck,
  BBadge, BMedia, BIconClock, BIconCash,
  BIconClipboardData, BIconEject, BIconFileDiff, BIconArrowDown,
  BDropdown,
  BDropdownItem,
  BAvatar,
} from 'bootstrap-vue'
import { keybase } from '@/libs/fetch'
import {
  getCachedValidators,
  getStakingValidatorByHex,
  getValidatorByHex,
  toDay, abbr, abbrMessage, tokenFormatter,
} from '@/libs/utils'
import { decodeTxRaw } from '@cosmjs/proto-signing'
import { fromBase64 } from '@cosmjs/encoding'
import Tx from '@/libs/data/tx'
// import fetch from 'node-fetch'

export default {
  components: {
    BTab,
    BTabs,
    BBadge,
    BIconPlay,
    BMedia,
    BIconCashStack,
    BIconBoxArrowUp,
    BIconPersonPlus,
    BIconPersonCheck,
    BCard,
    BTable,
    BCardHeader,
    BDropdown,
    BDropdownItem,
    BCardTitle,
    BAvatar,
    BIconClock,
    BIconCash,
    BIconClipboardData,
    BIconEject,
    BIconFileDiff,
    BIconArrowDown,
  },
  directives: {
    'b-tooltip': VBTooltip,
  },
  data() {
    return {
      islive: true,
      blocks: [],
      txs: [],
      list_fields: [
        {
          key: 'height',
          sortable: true,
        },
        {
          key: 'hash',
          tdClass: 'd-none d-lg-block text-truncate',
        },
        {
          key: 'proposer',
          tdClass: 'text-truncate',
        },
        {
          sortable: true,
          key: 'txs',
        },
        {
          key: 'messages',
        },
        {
          sortable: true,
          key: 'time',
        },
      ],
      txFields: [
        { key: 'hash' },
        { key: 'time', formatter: v => toDay(v, 'from') },
        { key: 'fee', formatter: v => tokenFormatter(v) },
        { key: 'status' },
        { key: 'messages', formatter: v => abbrMessage(v) },
        { key: 'memo' },
      ],
    }
  },
  created() {
    this.$http.getLatestBlock().then(res => {
      this.blocks.push(res)
      const list = []
      const { height } = res.block.header
      for (let i = 1; i < 25; i += 1) {
        list.push(height - i)
      }

      if (!getCachedValidators()) {
        this.$http.getValidatorList()
      }

      let promise = Promise.resolve()
      list.forEach(item => {
        promise = promise.then(() => new Promise(resolve => {
          this.$http.getBlockByHeight(item).then(b => {
            resolve()
            this.blocks.push(b)
            if (this.txs.length < 20) {
              this.extractTx(b, 'tail')
            }
          })
        }))
      })
      this.timer = setInterval(this.fetch, 6000)
    })
  },
  beforeDestroy() {
    this.islive = false
    clearInterval(this.timer)
  },
  methods: {
    length: v => (Array.isArray(v) ? v.length : 0),
    shortHash: v => abbr(v),
    formatTime: v => toDay(v, 'from'),
    formatProposer(v) {
      return getValidatorByHex(this.$http.config.chain_name, v).description.moniker
    },
    msgColor(msg) {
      if (msg.typeUrl.startsWith('/cosmos.staking')) {
        return ['info', 'black']
      }
      if (msg.typeUrl.startsWith('/cosmos.bank')) {
        return ['warning', 'white']
      }
      if (msg.typeUrl.startsWith('/cosmos.distribution')) {
        return ['danger', 'danger']
      }
      if (msg.typeUrl.startsWith('/cosmos.mint')) {
        return ['success', 'dark']
      }
      if (msg.typeUrl.startsWith('/cosmos.auth')) {
        return ['primary', 'white']
      }
      if (msg.typeUrl.startsWith('/cosmos.authz')) {
        return ['secondary', 'white']
      }
      if (msg.typeUrl.startsWith('/cosmos.slashing')) {
        return ['danger', 'white']
      }
      if (msg.typeUrl.startsWith('/cosmos.gov')) {
        return ['info', 'info']
      }
      return ['primary', 'white']
    },
    txLengthColor(i) {
      if (i === 0) {
        return 'primary'
      } if (i === 1) {
        return 'info'
      } if (i === 2) {
        return 'success'
      } if (i === 3) {
        return 'warning'
      }
      return 'danger'
    },
    formatProposerV(v) {
      return getValidatorByHex(this.$http.config.chain_name, v)
    },
    avatar(validator) {
      const v = this.formatProposerV(validator)
      const { identity } = v.description
      keybase(identity).then(d => {
        if (Array.isArray(d.them) && d.them.length > 0) {
          this.$set(this.validator, 'avatar', d.them[0].pictures.primary.url)
          this.$store.commit('cacheAvatar', { identity, url: d.them[0].pictures.primary.url })
          return d.them[0].pictures.primary.url
        }
        return ''
      })
      return ''
    },
    initData(block) {
      const { txs } = block.data
      if (txs === null) {
        return []
      }
      const array = []
      for (let i = 0; i < txs.length; i += 1) {
        let tx = new Tx()
        try {
          const origin = decodeTxRaw(fromBase64(txs[i]))
          tx = Tx.create(origin)
          tx.time = block.header.time
          tx.code = 0
          tx.status = 0
        } catch (e) {
          return []
        }
        tx.setHash(txs[i])
        array.push(tx)
      }
      if (array.length > 0) {
        return array
      }
      return []
    },
    fetch() {
      this.$http.getLatestBlock().then(b => {
        const has = this.blocks.findIndex(x => x.block.header.height === b.block.header.height)
        if (has < 0) {
          this.blocks.unshift(b)
          this.extractTx(b)
        }
        if (this.blocks.length > 200) this.blocks.pop()
      })
    },
    extractTx(block, direction = 'head') {
      const { txs } = block.block.data
      if (txs === null) return
      for (let i = 0; i < txs.length; i += 1) {
        let tx = new Tx()
        try {
          const origin = decodeTxRaw(fromBase64(txs[i]))
          tx = Tx.create(origin)
          tx.time = block.block.header.time
        } catch (e) {
          // catch errors
        }
        tx.setHash(txs[i])
        if (direction === 'head') {
          this.txs.unshift(tx)
          if (this.txs.length > 200) {
            this.txs.pop()
          }
        } else if (this.txs.length < 100) {
          this.txs.push(tx)
        }
      }
    },
  },
}
</script>
<style>
b-avatar,
b-badge {
  box-shadow: 0px 2px 8px 2px rgba(0, 0, 0, 0.15);
}
</style>
