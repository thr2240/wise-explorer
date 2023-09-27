<template>
  <div>
<b-link href="https://ollostation.zone">
          <feather-icon
            v-b-tooltip.hover.v-dark
            v-b-tooltip.hover.bottom="`OLLO Homepage`"
            color="gray"
            icon="HomeIcon"
            size="15"
            style="opacity:1; margin-right: 9px;"
            class="cursor-pointer"
          />
          </b-link>
<b-link href="https://twitter.com/ollostation">
          <feather-icon
            v-b-tooltip.hover.v-dark
            v-b-tooltip.hover.bottom="`OLLO Twitter`"
            color="gray"
            icon="TwitterIcon"
            size="15"
            style="opacity:1; margin-right: 9px;"
            class="cursor-pointer"
          />
          </b-link>
<b-link href="https://github.com/ollo-station">
          <feather-icon
            v-b-tooltip.hover.v-dark
            v-b-tooltip.hover.bottom="`OLLO GitHub`"
            color="gray"
            icon="GithubIcon"
            style="opacity:1; margin-right: 9px;"
            size="15"
            class="cursor-pointer"
          />
          </b-link>
<b-link href="https://docs.ollo.zone">
          <feather-icon
            v-b-tooltip.hover.v-dark
            v-b-tooltip.hover.bottom="`OLLO Docs`"
            color="gray"
            icon="InfoIcon"
            size="15"
            style="opacity:1; margin-right: 9px;"
            class="cursor-pointer"
          />
          </b-link>
          </div>
</template>

<script lang="jsx">
import {
  BLink, BNavbarNav, BMedia, BMediaAside, BAvatar, BMediaBody, VBTooltip, BButton,
  BBadge,
  BIconCaretDown,
  BIconChevronDown,
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

export default {
  components: {
    BLink,
    BNavbarNav,
    BAvatar,
    BBadge,
    BMedia,
    BIconCaretDown,
    BIconChevronDown,
    BIconThreeDotsVertical,
    BMediaAside,
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
      default: () => {},
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
.navbar-container {
}
.gradt {
font-weight: 500;
text-shadow: 1px 1px 3px 0px rgba(0,0,0,0.3);
background: -webkit-linear-gradient(235deg, #9a67f0 20%,#3Ba9DB 100%);
-webkit-background-clip: text;
background-clip: text;
-webkit-text-fill-color: transparent;

}
  .gradb{
font-weight: 500;
text-shadow: 1px 1px 6px 2px rgba(0,0,0,0.9) !important;
background: -webkit-linear-gradient(235deg, #9a67f0 -10%,#3Ba9DB 110%);
}
* {box-shadow: none}
* > * {
box-shadow: none
}
* > * > * {
box-shadow: none
}
</style>
