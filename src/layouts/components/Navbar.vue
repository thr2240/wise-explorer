<template>
  <div class="navbar-container d-flex content align-items-center">

    <!-- Nav Menu Toggler -->
    <ul class="nav navbar-nav d-md-none">
      <li class="nav-item">
        <b-link class="nav-link" @click="toggleVerticalMenuActive">
          <b-avatar v-if="selected_chain && selected_chain.logo" variant="light-primary" class="badge-minimal" badge
            badge-top rounded size="41" :src="selected_chain.logo" :badge-variant="variant" />
          <feather-icon v-else icon="MenuIcon" size="30" />
        </b-link>
      </li>
    </ul>

    <!-- Left Col -->
    <div class="align-items-center py-0 pr-1 flex-shrink-1 d-none d-md-flex"
      style="border-right: 1px solid rgba(255,255,255,0.05);">
      <b-media v-if="selected_chain" class="align-items-center vertical-align-center" no-body>
        <b-media-aside class="">
          <b-link @click="toggleVerticalMenuActive">
            <b-avatar v-b-tooltip.hover.v-dark v-b-tooltip.hover.bottom="tips"
              style="box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.15); border: 1px solid rgba(255,255,255,0.05); padding: 3px;"
              badge badge-top rounded size="41" :src="selected_chain.logo" class="badge-minimal"
              :badge-variant="variant" />
          </b-link>
        </b-media-aside>
        <b-media-body style="margin: 0; padding: 0;">
          <h6 class="">
            <span class="text-uppercase">
              {{ chainid || selected_chain.chain_name }}
              <!-- <b-badge variant="light-success" size="sm"> -->
              <!-- </b-badge> -->
            </span>
            <feather-icon @click="block" class="cursor-pointer d-md-none d-lg-inline-block text-success"
              icon="RefreshCwIcon" size="12" style="padding: 0px; margin-left: 0px;" />
          </h6>
          <b-link @click="block" class="d-lg-inline-flex d-md-none">
            <b-badge v-b-tooltip.hover.v-dark v-b-tooltip.hover.bottom="`Last updated ${formatTime(lastBlockTime)}`"
              size="sm" style="padding: 0.1; font-size: 10px;" to="./blocks" :variant="`light-${variant}`" rounded>
              <feather-icon icon="BoxIcon" size="12" />
              {{ height }}
            </b-badge>
            <b-badge v-b-tooltip.hover.v-dark
              v-b-tooltip.hover.bottom="`Cosmos SDK version ${ selected_chain.sdk_version || '-' }`" size="sm"
              to="./params" style="font-weight: 400; font-size: 10px; margin-left: 3px;" variant="light-info">
              <feather-icon icon="TagIcon" size="12" />
              {{ selected_chain.sdk_version || '-' }}
            </b-badge>
          </b-link>
        </b-media-body>
      </b-media>
    </div>
    <div style="margin-left: 8px;" class="align-items-center py-0 flex-shrink-1 d-none d-md-flex">
      <b-media v-if="selected_chain" class="align-items-center vertical-align-center" no-body>
        <b-media-aside class="">
          <div class="d-flex-box">
            <div class="flex-grow-1 d-flex d-flex-inline">
              <b-dropdown offset="0px" variant="flat-primary" no-caret style="padding: 0px; margin-right: 6px;"
                toggle-class="p-0" left sm>
                <template #button-content>
                  <b-badge style="font-size: 10px;" class="cursor-pointer d-md-none d-lg-flex" variant="light-primary"
                    size="sm">
                    <feather-icon :icon="`${accountsIcon(accounts.length)}`" size="12" />
                    &nbsp;{{ accounts.length }}
                  </b-badge>
                </template>

                <b-dropdown-item style="font-size: 12px; font-family: Open Sans;" v-for="(item,k) in accounts" :key="k"
                  :disabled="!item.address" @click="updateDefaultWallet(item.wallet)">
                  <div class="d-flex flex-column">
                    <div class="d-flex justify-content-between">
                      <span class="font-weight-normal">
                        {{ item.wallet }}&nbsp;
                        <b-avatar v-if="item.wallet===walletName" variant="success" size="16px">
                          <feather-icon icon="CheckIcon" />
                        </b-avatar>
                      </span>
                      <b-badge variant="primary" :to="`/${selected_chain.chain_name}/account/${item.address.addr}`">
                        <feather-icon icon="ArrowRightIcon" />
                      </b-badge>
                    </div>
                    <small class="text-muted">{{ item.address ? formatAddr(item.address.addr) : `Not available on
                    ${selected_chain.chain_name}` }}</small>
                  </div>
                </b-dropdown-item>
                <b-dropdown-divider v-if="accounts.length > 0" />
                <b-dropdown-item to="/wallet/import" style="font-size: 12px; font-family:sans-serif;">
                  <feather-icon icon="PlusIcon" size="16" />
                  <span class="align-middle ml-50">Add Address </span>
                </b-dropdown-item>

                <b-dropdown-divider v-if="accounts.length > 0" />
                <b-dropdown-item :to="``" v-if="accounts.length > 0" style='font-family: "Open Sans";'>
                  <feather-icon icon="PowerIcon" size="16" style="color: danger;" class="text-danger" />
                  <span style="font-size: 12px; color: danger !important;" class="text-danger align-middle ml-50">

                    Disconnect</span>
                </b-dropdown-item>
              </b-dropdown>
              <b-link v-if="accounts.length > 0"
                :to="`/${selected_chain.chain_name}/account/${accounts.find(a => a.wallet === walletName).address.addr}`"
                class="text-primary"
                style="font-size: 10.5px; font-family: sans-serif; font-weight: 300;margin-left: 2px;  margin-right: 5px;">
                <feather-icon icon="UserIcon" size="12" />
                <span v-if="accounts.length > 0"
                  style="margin-left: 5px;color: rgba(255,255,255,0.5); margin-left: 4px;">
                  {{ formatAddr(accounts.find(a => a.wallet === walletName).address.addr) || '-' }}
                </span>
              </b-link>
              <span v-else
                style="margin-left: 5px;color: rgba(255,255,255,0.3); margin-left: 4px;font-size: 10.5px; font-family: sans-serif; font-weight: 300;margin-left: 2px;  margin-right: 5px;">
                No accounts added
              </span>
            </div>
            <b-dropdown offset="20px" variant="flat-info" no-caret style="padding: 0px; margin-right: 6px;"
              toggle-class="p-0" left sm>
              <template #button-content>
                <b-badge style="font-size: 10px;" class="cursor-pointer d-md-none d-lg-flex" variant="light-info"
                  size="sm">
                  <feather-icon icon="MenuIcon" size="11" />
                  &nbsp;{{ apiOptions.length }}
                </b-badge>

              </template>
              <b-dropdown-item style="font-family: sans-serif; font-size: 12px; backdrop-filter: blur(6px);"
                v-for="(item, i) in apiOptions" :key="item" @click="change(i)">
                {{ item }}&nbsp;
                <b-avatar v-if="currentApi === item" variant="success" size="16px">
                  <feather-icon icon="CheckIcon" />
                </b-avatar>
              </b-dropdown-item>
            </b-dropdown>
            <b-link :href="`${currentApi}`" class="text-info"
              style="font-size: 10.5px; font-family: sans-serif; font-weight: 300;margin-left: 2px;  margin-right: 5px;">
              <feather-icon icon="LinkIcon" size="12" />
              <span style="margin-left: 5px;color: rgba(255,255,255,0.5);">{{ currentApi }}</span>
            </b-link>
          </div>
        </b-media-aside>
        <b-media-body class="">
        </b-media-body>
      </b-media>
    </div>

    <!-- Right Col -->
    <b-navbar-nav class="nav align-items-center ml-auto">
      <!-- <dark-toggler class="d-none d-lg-block" /> -->
      <socials />
      <search-bar />&nbsp;&nbsp;
      <!-- <locale /> -->
      <!-- <div -->
      <!--   v-for="(acc,k) in accounts" -->
      <!--   :key="k" -->
      <!--   class="align-items-center py-0 pr-1 flex-shrink-1 d-none d-md-flex" -->
      <!--   style="padding-left: 8px; border-left: 1px solid rgba(255,255,255,0.1);" -->
      <!--   > -->
      <!--   <b-media -->
      <!--     @click="updateDefaultWallet(acc.wallet)" -->
      <!--     class="align-items-center vertical-align-center" -->
      <!--     no-body -->
      <!--   > -->
      <!--     <b-media-aside> -->
      <!--       <b-badge -->
      <!--         v-if="acc.wallet===walletName" -->
      <!--         class="cursor-pointer" -->
      <!--         @click="updateDefaultWallet(acc.wallet)" -->
      <!--         style="font-size:8px;" -->
      <!--         variant="success" -->
      <!--         size="sm" -->
      <!--       > -->
      <!--         {{ k }} -->
      <!--       </b-badge> -->
      <!--     </b-media-aside> -->
      <!--     <b-media-body> -->
      <!--       <small -->
      <!--         v-if="acc.wallet===walletName" -->
      <!--         class="text-muted" -->
      <!--         style="font-family: sans-serif; font-size: 10px;" -->
      <!--       > -->
      <!--       &nbsp;&nbsp;{{ acc.address.addr }} -->
      <!--       </small> -->
      <!--       <b-badge -->
      <!--         v-else -->
      <!--         style="font-size:8px;" -->
      <!--         variant="light-primary" -->
      <!--         size="sm" -->
      <!--       > -->
      <!--         {{ k }} -->
      <!--       </b-badge> -->
      <!--     </b-media-body> -->

      <!--   </b-media> -->
      <!-- </div> -->
      <b-dropdown style="ml-1 font-family:sans-serif; box-shadow: none;" variant="link" class="sans-serif" offset="10"
        no-caret toggle-class="p-0" right>

        <template #button-content>

          <div class="align-items-center py-0 pl-1 flex-shrink-1 d-lg-flex"
            style="border-left: 1px solid rgba(255,255,255,0.1);">
            <b-media vertical-align="center" class="text-truncate mr-1"
              style="padding: 1.5px; padding-left: 4.5px; padding-right: 10.5px; " no-body>
              <b-media-aside class="">
                <b-avatar v-b-tooltip.hover.v-dark
                  v-b-tooltip.hover.bottom="`${walletName} has ${accounts.length} ${chainid || selected_chain.chain_name} accounts`"
                  variant="primary"
                  style="color: white;background: -webkit-linear-gradient(235deg, #9a67f0 -10%,#3Ba9DB 110%);" badge
                  badge-top class="badge-minimal padding-2" badge-variant="success" />
              </b-media-aside>
              <b-media-body class="my-auto">
                <h6 class="mb-0 " style="box-shadow: none !important;">
                  <span style="font-size: 12.5px; family: 'Open Sans'; box-shadow: none !important; font-weight: 700;"
                    class="gradt">
                    {{ walletName }}
                  </span>
                  <small id="data-provider" class="text-muted">
                    {{ accounts.length }}
                  </small>
                </h6>
              </b-media-body>
              <b-icon-chevron-down style="margin-top: 1rem; size:xs; margin-left: 1rem;" size="6px" />
            </b-media>
          </div>

        </template>

        <b-dropdown-item style="font-family: Roboto;" v-for="(item,k) in accounts" :key="k" :disabled="!item.address"
          @click="updateDefaultWallet(item.wallet)">
          <div class="d-flex flex-column">
            <div class="d-flex justify-content-between">
              <span class="font-weight-bolder">
                {{ item.wallet }}
                <b-avatar v-if="item.wallet===walletName" variant="success" size="sm">
                  <feather-icon icon="CheckIcon" />
                </b-avatar>
              </span>
              <b-link :to="`/${selected_chain.chain_name}/account/${item.address.addr}`">
                <feather-icon icon="ArrowRightIcon" />
              </b-link>
            </div>
            <small class="text-muted">{{ item.address ? formatAddr(item.address.addr) : `Not available on
            ${selected_chain.chain_name}` }}</small>
          </div>
        </b-dropdown-item>
        <b-dropdown-divider v-if="accounts.length > 0" />
        <b-dropdown-item to="/wallet/import" style="font-family:sans-serif;">
          <feather-icon icon="PlusIcon" size="16" />
          <span class="align-middle ml-50">Add Address </span>
        </b-dropdown-item>

        <b-dropdown-item v-if="accounts.length > 0" :to="{ name: 'accounts' }" style="font-family:sans-serif;">
          <feather-icon icon="InfoIcon" size="16" />
          <span class="align-middle ml-50">Manage Accounts</span>
        </b-dropdown-item>
        <b-dropdown-divider v-if="accounts.length > 0" />

        <b-dropdown-item :to="{ name: 'delegations' }" v-if="accounts.length > 0" style='font-family: Roboto;'>
          <feather-icon icon="BookOpenIcon" size="16" />
          <span class="align-middle ml-50">My Delegations</span>
        </b-dropdown-item>

        <b-dropdown-item :to="`/${selected_chain.chain_name}/uptime/my`" v-if="accounts.length > 0"
          style='font-family: Roboto;'>
          <feather-icon icon="AirplayIcon" size="16" />
          <span class="align-middle ml-50">My Validators</span>
        </b-dropdown-item>

        <b-dropdown-item :to="`/wallet/votes`" v-if="accounts.length > 0" style='font-family: Roboto;'>
          <feather-icon icon="PocketIcon" size="16" />
          <span class="align-middle ml-50">My Votes</span>
        </b-dropdown-item>

        <b-dropdown-item :to="`/wallet/transactions`" v-if="accounts.length > 0" style='font-family: Roboto;'>
          <feather-icon icon="LayersIcon" size="16" />
          <span class="align-middle ml-50">My Transactions</span>
        </b-dropdown-item>
        <b-dropdown-divider v-if="accounts.length > 0" />
        <b-dropdown-item :to="``" v-if="accounts.length > 0" style='font-family: "Open Sans";'>
          <feather-icon icon="PowerIcon" size="16" style="color: danger;" class="text-danger" />
          <span style="font-size: 12px; color: danger !important;" class="text-danger align-middle ml-50">

            Disconnect</span>
        </b-dropdown-item>
      </b-dropdown>
    </b-navbar-nav>
  </div>
</template>

<script lang="jsx">
import {
  BLink, BNavbarNav, BMedia, BMediaAside, BAvatar, BMediaBody, VBTooltip, BButton,
  BBadge,
  BIconCaretDown,
  BIconChevronDown,
  BDropdownItemButton,
  BIconWallet2,
  BIconThreeDotsVertical,
  BDropdown, BDropdownItem, BDropdownDivider,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import DarkToggler from '@core/layouts/components/app-navbar/components/DarkToggler.vue'
import Locale from '@core/layouts/components/app-navbar/components/Locale.vue'
import SearchBar from '@core/layouts/components/app-navbar/components/SearchBar.vue'
// import CartDropdown from '@core/layouts/components/app-navbar/components/CartDropdown.vue'
import { getLocalAccounts, timeIn, toDay } from '@/libs/utils'
import Socials from './Socials.vue'
// import UserDropdown from '@core/layouts/components/app-navbar/components/UserDropdown.vue'

export default {
  components: {
    BLink,
    BNavbarNav,
    BAvatar,
    BBadge,
    Socials,
    BMedia,
    BIconCaretDown,
    BIconChevronDown,
    BIconThreeDotsVertical,
    BMediaAside,
    BDropdownItemButton,
    BMediaBody,
    BIconWallet2,
    BButton,
    BDropdown,
    BDropdownItem,
    BDropdownDivider,

    // Navbar Components
    DarkToggler,
    Locale,
    SearchBar,
    // CartDropdown,
    // UserDropdown,
  },
  directives: {
    'b-tooltip': VBTooltip,
    Ripple,
  },
  props: {
    toggleVerticalMenuActive: {
      type: Function,
      default: () => { },
    },
  },
  data() {
    return {
      variant: 'success',
      userVariant: 'success',
      tips: 'Synced',
      index: 0,
      chainid: '',
      height: 0,
      lastBlockTime: '',
    }
  },
  computed: {
    walletName() {
      const key = this.$store?.state?.chains?.defaultWallet
      return key || 'Wallet'
    },
    selected_chain() {
      this.block()
      return this.$store.state.chains.selected
    },
    blockTime() {
      return this.lastBlockTime
    },
    chainVariant() {
      return this.variant
    },
    userLoggedIn() {
      return this.userVariant
    },
    chainHeight() {
      return this.height
    },
    currentApi() {
      return this.index + 1 > this.apiOptions.length ? this.apiOptions[0] : this.apiOptions[this.index]
    },
    apiOptions() {
      const conf = this.$store.state.chains.selected
      if (Array.isArray(conf.api)) {
        return conf.api
      }
      return [conf.api]
    },
    accounts() {
      let accounts = getLocalAccounts() || {}
      accounts = Object.entries(accounts)
        .map(v => ({ wallet: v[0], address: v[1].address.find(x => x.chain === this.selected_chain.chain_name) }))
        .filter(v => v.address)

      // accounts > 0 and wallet not setted, pick the first one as default
      if (accounts.length > 0 && accounts.findIndex(x => x.wallet === this.walletName) < 0) {
        this.updateDefaultWallet(accounts[0].wallet)
      }

      if (accounts.findIndex(x => x.wallet === this.walletName) < 0 && this.walletName !== 'Wallet') {
        this.updateDefaultWallet(null)
      }
      return accounts
    },
  },
  methods: {
    formatTime(t) { return toDay(t) },
    accountsIcon() {
      switch (this.accounts.length) {
        case 0: return 'UserPlusIcon'
        case 1: return 'UserIcon'
        case 2: return 'UsersIcon'
        default: return 'UserIcon'
      }
    },
    formatAddr(v) {
      return v.substring(0, 10).concat('...', v.substring(v.length - 10))
    },
    updateDefaultWallet(v) {
      if (v === null) {
        this.userVariant = 'primary'
      } else {
        this.userVariant = 'success'
      }
      this.$store.commit('setDefaultWallet', v)
    },
    change(v) {
      this.index = v
      const conf = this.$store.state.chains.selected
      localStorage.setItem(`${conf.chain_name}-api-index`, v)
      window.location.reload()
    },
    block() {
      const conf = this.$store.state.chains.selected
      const s = localStorage.getItem(`${conf.chain_name}-api-index`) || 0
      this.index = Number(s)
      this.$store.commit('setHeight', 0)
      this.$http.getLatestBlock().then(block => {
        this.chainid = block.block.header.chain_id
        this.height = block.block.header.height
        this.lastBlockTime = block.block.header.time
        this.$store.commit('setHeight', Number(block.block.header.height))
        if (timeIn(block.block.header.time, 1, 'm')) {
          this.variant = 'danger'
          this.tips = `Halted ${toDay(block.block.header.time, 'from')}, Height: ${this.$store.state.chains.height} `
        } else {
          this.variant = 'success'
          this.tips = 'Synced'
        }
      })
    },
  },
}
</script>
<style>
.navbar-container {}

.gradt {
  font-weight: 500;
  text-shadow: 1px 1px 3px 0px rgba(0, 0, 0, 0.3);
  background: -webkit-linear-gradient(235deg, #9a67f0 20%, #3Ba9DB 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;

}

.gradb {
  font-weight: 500;
  text-shadow: 1px 1px 4px 2px rgba(0, 0, 0, 0.9) !important;
  background: -webkit-linear-gradient(235deg, #9a67f0 -10%, #3Ba9DB 110%);
}

* {
  box-shadow: none
}

*>* {
  box-shadow: none
}

*>*>* {
  box-shadow: none
}
</style>
<!-- <template> -->
<!--   <div class="navbar-container d-flex content align-items-center"> -->

    <!-- Left Col -->
<!--     <div class="bookmark-wrapper align-items-center flex-grow-1 d-none d-lg-flex"> -->
<!--       <b-media -->
<!--         v-if="selected_chain" -->
<!--         no-body -->
<!--       > -->
<!--         <b-media-aside class="mr-75"> -->
<!--           <b-link -->
<!--             class="nav-link" -->
<!--             @click="toggleVerticalMenuActive" -->
<!--           > -->
<!--             <b-avatar -->
<!--               v-b-tooltip.hover.bottom="tips" -->
<!--               variant="transparent" -->
<!--               badge -->
<!--               rounded -->
<!--               size="42" -->
<!--               :src="selected_chain.logo" -->
<!--               class="badge-minimal" -->
<!--               :badge-variant="variant" -->
<!--             /></b-link> -->
<!--         </b-media-aside> -->
<!--         <b-media-body class="my-auto"> -->
<!--           <h6 class="mb-0 "> -->
<!--             <span class="text-uppercase">{{ chainid || selected_chain.chain_name }}</span> -->
<!--           </h6> -->
<!--           <small id="data-provider"> -->
<!--             <b-dropdown -->
<!--               class="ml-0" -->
<!--               variant="flat-primary" -->
<!--               no-caret -->
<!--               toggle-class="p-0" -->
<!--               left -->
<!--               sm -->
<!--             > -->
<!--               <template #button-content> -->
<!--                 <feather-icon -->
<!--                   icon="RepeatIcon" -->
<!--                   size="12" -->
<!--                   class="cursor-pointer" -->
<!--                 /> -->
<!--               </template> -->
<!--               <b-dropdown-item -->
<!--                 v-for="(item, i) in apiOptions" -->
<!--                 :key="item" -->
<!--                 @click="change(i)" -->
<!--               > -->
<!--                 {{ item }} -->
<!--               </b-dropdown-item> -->
<!--             </b-dropdown> -->
<!--             {{ currentApi }} ({{ selected_chain.sdk_version || '-' }}) -->
<!--           </small> -->
<!--         </b-media-body> -->
<!--       </b-media> -->
<!--     </div> -->

    <!-- <dark-Toggler class="d-none d-lg-block" /> -->
    <!-- Right Col -->
<!--     <b-navbar-nav class="nav align-items-center ml-auto"> -->
<!--       <dark-Toggler /> -->
<!--       <search-bar /> -->
<!--       <locale class="d-none" /> -->
<!--       <b-dropdown -->
<!--         class="ml-1" -->
<!--         variant="link" -->
<!--         no-caret -->
<!--         toggle-class="p-0" -->
<!--         right -->
<!--       > -->

<!--         <template #button-content> -->
<!--           <b-button -->
<!--             v-ripple.400="'rgba(255, 255, 255, 0.15)'" -->
<!--             variant="primary" -->
<!--             class="btn-icon" -->
<!--           > -->
<!--             <feather-icon icon="KeyIcon" /> -->
<!--             {{ walletName }} -->
<!--           </b-button> -->
<!--         </template> -->

<!--         <b-dropdown-item -->
<!--           v-for="(item,k) in accounts" -->
<!--           :key="k" -->
<!--           :disabled="!item.address" -->
<!--           @click="updateDefaultWallet(item.wallet)" -->
<!--         > -->
<!--           <div class="d-flex flex-column"> -->
<!--             <div class="d-flex justify-content-between"> -->
<!--               <span class="font-weight-bolder">{{ item.wallet }} -->
<!--                 <b-avatar -->
<!--                   v-if="item.wallet===walletName" -->
<!--                   variant="success" -->
<!--                   size="sm" -->
<!--                 > -->
<!--                   <feather-icon icon="CheckIcon" /> -->
<!--                 </b-avatar> -->
<!--               </span> -->
<!--               <b-link :to="`/${selected_chain.chain_name}/account/${item.address.addr}`"> -->
<!--                 <feather-icon icon="ArrowRightIcon" /> -->
<!--               </b-link> -->
<!--             </div> -->
<!--             <small>{{ item.address ? formatAddr(item.address.addr) : `Not available on ${selected_chain.chain_name}` }}</small> -->
<!--           </div> -->
<!--         </b-dropdown-item> -->
<!--         <b-dropdown-divider /> -->
<!--         <b-dropdown-item to="/wallet/import"> -->
<!--           <feather-icon -->
<!--             icon="PlusIcon" -->
<!--             size="16" -->
<!--           /> -->
<!--           <span class="align-middle ml-50">Connect Wallet</span> -->
<!--         </b-dropdown-item> -->
<!--         <b-dropdown-divider /> -->

<!--         <b-dropdown-item :to="{ name: 'accounts' }"> -->
<!--           <feather-icon -->
<!--             icon="KeyIcon" -->
<!--             size="16" -->
<!--           /> -->
<!--           <span class="align-middle ml-50">Accounts</span> -->
<!--         </b-dropdown-item> -->

<!--         <b-dropdown-item :to="{ name: 'delegations' }"> -->
<!--           <feather-icon -->
<!--             icon="BookOpenIcon" -->
<!--             size="16" -->
<!--           /> -->
<!--           <span class="align-middle ml-50">My Delegations</span> -->
<!--         </b-dropdown-item> -->

<!--         <b-dropdown-item :to="`/${selected_chain.chain_name}/uptime/my`"> -->
<!--           <feather-icon -->
<!--             icon="AirplayIcon" -->
<!--             size="16" -->
<!--           /> -->
<!--           <span class="align-middle ml-50">My Validators</span> -->
<!--         </b-dropdown-item> -->

<!--         <b-dropdown-item :to="`/wallet/votes`"> -->
<!--           <feather-icon -->
<!--             icon="PocketIcon" -->
<!--             size="16" -->
<!--           /> -->
<!--           <span class="align-middle ml-50">My Votes</span> -->
<!--         </b-dropdown-item> -->

<!--         <b-dropdown-item :to="`/wallet/transactions`"> -->
<!--           <feather-icon -->
<!--             icon="LayersIcon" -->
<!--             size="16" -->
<!--           /> -->
<!--           <span class="align-middle ml-50">My Transactions</span> -->
<!--         </b-dropdown-item> -->
<!--       </b-dropdown> -->
<!--     </b-navbar-nav> -->
<!--   </div> -->
<!-- </template> -->

<!-- <script> -->
<!-- import { -->
<!--   BLink, BNavbarNav, BMedia, BMediaAside, BAvatar, BMediaBody, VBTooltip, BButton, -->
<!--   BDropdown, BDropdownItem, BDropdownDivider, -->
<!-- } from 'bootstrap-vue' -->
<!-- import Ripple from 'vue-ripple-directive' -->
<!-- import DarkToggler from '@core/layouts/components/app-navbar/components/DarkToggler.vue' -->
<!-- import Locale from '@core/layouts/components/app-navbar/components/Locale.vue' -->
<!-- import SearchBar from '@core/layouts/components/app-navbar/components/SearchBar.vue' -->
<!-- // import CartDropdown from '@core/layouts/components/app-navbar/components/CartDropdown.vue' -->
<!-- import { getLocalAccounts, timeIn, toDay } from '@/libs/utils' -->
<!-- // import UserDropdown from '@core/layouts/components/app-navbar/components/UserDropdown.vue' -->

<!-- export default { -->
<!--   components: { -->
<!--     BLink, -->
<!--     BNavbarNav, -->
<!--     BAvatar, -->
<!--     BMedia, -->
<!--     BMediaAside, -->
<!--     BMediaBody, -->
<!--     BButton, -->
<!--     BDropdown, -->
<!--     BDropdownItem, -->
<!--     BDropdownDivider, -->

<!--     // Navbar Components -->
<!--     DarkToggler, -->
<!--     Locale, -->
<!--     SearchBar, -->
<!--     // CartDropdown, -->
<!--     // UserDropdown, -->
<!--   }, -->
<!--   directives: { -->
<!--     'b-tooltip': VBTooltip, -->
<!--     Ripple, -->
<!--   }, -->
<!--   props: { -->
<!--     toggleVerticalMenuActive: { -->
<!--       type: Function, -->
<!--       default: () => {}, -->
<!--     }, -->
<!--   }, -->
<!--   data() { -->
<!--     return { -->
<!--       variant: 'success', -->
<!--       tips: 'Synced', -->
<!--       index: 0, -->
<!--       chainid: '', -->
<!--     } -->
<!--   }, -->
<!--   computed: { -->
<!--     walletName() { -->
<!--       const key = this.$store?.state?.chains?.defaultWallet -->
<!--       return key || 'Wallet' -->
<!--     }, -->
<!--     selected_chain() { -->
<!--       this.block() -->
<!--       return this.$store.state.chains.selected -->
<!--     }, -->
<!--     chainVariant() { -->
<!--       return this.variant -->
<!--     }, -->
<!--     currentApi() { -->
<!--       return this.index + 1 > this.apiOptions.length ? this.apiOptions[0] : this.apiOptions[this.index] -->
<!--     }, -->
<!--     apiOptions() { -->
<!--       const conf = this.$store.state.chains.selected -->
<!--       if (Array.isArray(conf.api)) { -->
<!--         return conf.api -->
<!--       } -->
<!--       return [conf.api] -->
<!--     }, -->
<!--     accounts() { -->
<!--       let accounts = getLocalAccounts() || {} -->
<!--       accounts = Object.entries(accounts) -->
<!--         .map(v => ({ wallet: v[0], address: v[1].address.find(x => x.chain === this.selected_chain.chain_name) })) -->
<!--         .filter(v => v.address) -->

<!--       // accounts > 0 and wallet not setted, pick the first one as default -->
<!--       if (accounts.length > 0 && accounts.findIndex(x => x.wallet === this.walletName) < 0) { -->
<!--         this.updateDefaultWallet(accounts[0].wallet) -->
<!--       } -->

<!--       if (accounts.findIndex(x => x.wallet === this.walletName) < 0 && this.walletName !== 'Wallet') { -->
<!--         this.updateDefaultWallet(null) -->
<!--       } -->
<!--       return accounts -->
<!--     }, -->
<!--   }, -->
<!--   methods: { -->
<!--     formatAddr(v) { -->
<!--       return v.substring(0, 10).concat('...', v.substring(v.length - 10)) -->
<!--     }, -->
<!--     updateDefaultWallet(v) { -->
<!--       this.$store.commit('setDefaultWallet', v) -->
<!--     }, -->
<!--     change(v) { -->
<!--       this.index = v -->
<!--       const conf = this.$store.state.chains.selected -->
<!--       localStorage.setItem(`${conf.chain_name}-api-index`, v) -->
<!--       window.location.reload() -->
<!--     }, -->
<!--     block() { -->
<!--       const conf = this.$store.state.chains.selected -->
<!--       const s = localStorage.getItem(`${conf.chain_name}-api-index`) || 0 -->
<!--       this.index = Number(s) -->
<!--       this.$store.commit('setHeight', 0) -->
<!--       this.$http.getLatestBlock().then(block => { -->
<!--         this.chainid = block.block.header.chain_id -->
<!--         this.$store.commit('setHeight', Number(block.block.header.height)) -->
<!--         if (timeIn(block.block.header.time, 1, 'm')) { -->
<!--           this.variant = 'danger' -->
<!--           this.tips = `Halted ${toDay(block.block.header.time, 'from')}, Height: ${this.$store.state.chains.height} ` -->
<!--         } else { -->
<!--           this.variant = 'success' -->
<!--           this.tips = 'Synced' -->
<!--         } -->
<!--       }) -->
<!--     }, -->
<!--   }, -->
<!-- } -->
<!-- </script> -->
<style>
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
</style>
        <!-- <b-media-aside class=""> -->
        <!--   <div class="d-flex flex-column"> -->
        <!--     <div class="d-flex justify-content-between"> -->
        <!--       <span class="font-weight-bolder">{{ acc.wallet }} -->
        <!--         <b-avatar -->
        <!--           v-if="acc.wallet===walletName" -->
        <!--       v-b-tooltip.hover.bottom="tips" -->
        <!--           variant="success" -->
        <!--       style="padding: 4px;" -->
        <!--       badge badge-top -->
        <!--       rounded -->
        <!--       size="41" -->
        <!--       :src="selected_chain.logo" -->
        <!--       class="badge-minimal" -->
        <!--       :badge-variant="variant" -->
        <!--         > -->
        <!--           <feather-icon icon="CheckIcon" /> -->
        <!--         </b-avatar> -->
        <!--       </span> -->
        <!--       <b-link :to="`/${selected_chain.chain_name}/account/${acc.address.addr}`"> -->
        <!--         <feather-icon icon="ArrowRightIcon" /> -->
        <!--       </b-link> -->
        <!--     </div> -->
        <!--     <small class="text-muted">{{ item.address ? formatAddr(acc.address.addr) : `Not available on ${selected_chain.chain_name}` }}</small> -->
        <!--   </div> -->
        <!-- </b-media-aside> -->
        <!-- <b-media-body class="my-0"> -->
        <!--   <h6 class="mb-0 "> -->
        <!--     <span class="text-uppercase">{{ walletName }} -->
              <!-- <b-badge variant="light-success" size="sm"> -->
        <!--   <b-link -->
        <!--     @click="block" -->
        <!--   > -->
        <!--     <b-badge -->
        <!--       v-b-tooltip.hover.bottom="`Last updated ${formatTime(lastBlockTime)}`" -->
        <!--       size="sm" -->
        <!--       style="padding: 0.1; font-size: 10px;" -->
        <!--       to="./blocks" -->
        <!--       :variant="`light-${variant}`" -->
        <!--       rounded -->
        <!--     > -->
        <!--     {{ height }} -->
        <!--     </b-badge> -->
        <!--     <b-badge -->
        <!--     v-b-tooltip.hover.bottom="`Cosmos SDK version`" -->
        <!--     size="sm" -->
        <!--     to="./params" -->
        <!--     style="font-weight: 400; font-size: 10px; margin-left: 3px;" -->
        <!--     variant="light-info"> -->
        <!--     {{ selected_chain.sdk_version || '-' }} -->
        <!--     </b-badge> -->
        <!--     </b-link> -->
                <!-- </b-badge> -->
        <!--         </span> -->
        <!--   </h6> -->
        <!--   <small style="font-family: sans-serif; font-size: 11px;" id="data-provider" class="text-muted"> -->
        <!--     <b-dropdown -->
        <!--       class="ml-0" -->
        <!--       offset="20px" -->
        <!--       variant="flat-info" -->
        <!--       no-caret -->
        <!--       toggle-class="p-0" -->
        <!--       left -->
        <!--       sm -->
        <!--     > -->
        <!--       <template #button-content> -->
        <!--     <b-badge variant="light-info" size="sm" style="font-size: 9px;"> -->
        <!--         <feather-icon -->
        <!--           icon="MenuIcon" -->
        <!--           size="14" -->
        <!--           class="cursor-pointer" -->
        <!--         /> -->
        <!--       {{ apiOptions.length }} -->
        <!--     </b-badge> -->
        <!--       </template> -->
        <!--       <b-dropdown-item -->
        <!--         v-for="(item, i) in apiOptions" -->
        <!--         :key="item" -->
        <!--         @click="change(i)" -->
        <!--       > -->
        <!--         {{ item }} -->
        <!--       </b-dropdown-item> -->
        <!--     </b-dropdown> -->
        <!--     {{ currentApi }} -->
        <!--     <feather-icon -->
        <!--       icon="RefreshCwIcon" -->
        <!--       style="padding: 0px; margin-right: 6px; margin-left: 3px;" -->
        <!--       size="10" -->
        <!--       class="cursor-pointer text-info" -->
        <!--     /> -->
        <!--   </small> -->
        <!-- </b-media-body> -->
            <!-- v-b-tooltip.hover.v-dark -->
            <!-- v-b-tooltip.hover.bottom="`${accounts.length} addresses imported for ${chainid}`" -->
