<template>
  <b-dropdown :text="`Currency: ${currency2.toUpperCase()}`" size="sm" class="text-uppercase" variant="primary">
    <b-dropdown-item @click="setCurrency('usd')">
      USD
    </b-dropdown-item>
    <b-dropdown-item @click="setCurrency('cny')">
      CNY (人民币)
    </b-dropdown-item>
    <b-dropdown-item @click="setCurrency('eur')">
      EUR (Euro)
    </b-dropdown-item>
    <b-dropdown-item @click="setCurrency('jpy')">
      JPY (日本円)
    </b-dropdown-item>
    <b-dropdown-item @click="setCurrency('hkd')">
      HKD (港幣)
    </b-dropdown-item>
    <b-dropdown-item @click="setCurrency('sgd')">
      SGD (新加坡元)
    </b-dropdown-item>
    <b-dropdown-item @click="setCurrency('krw')">
      KRW (대한민국원)
    </b-dropdown-item>
  </b-dropdown>
</template>
<script>
import {
  BDropdown, BDropdownItem,
} from 'bootstrap-vue'
import {
  chartColors,
  formatNumber,
  formatTokenAmount, formatTokenDenom, getLocalAccounts, getLocalChains, getUserCurrency, getUserCurrencySign, numberWithCommas, setUserCurrency,
} from '@/libs/utils'

export default {
  components: {
    BDropdown,
    BDropdownItem,
    // eslint-disable-next-line vue/no-unused-components
    // eslint-disable-next-line vue/no-unused-components
  },
  directives: {
  },
  data() {
    return {
      currency: getUserCurrencySign(),
      currency2: getUserCurrency(),
      selectedAddress: '',
      selectedName: '',
      transferWindow: false,
      accounts: [],
      balances: {},
      delegations: {},
      ibcDenom: {},
      quotes: {},
      operationModalType: '',
      selectedChainName: '',
      options: {
        maintainAspectRatio: false,
        legend: {
          display: false,
        },
        // responsive: true,
        title: {
          display: true,
          text: 'Token Portfolio',
        },
        tooltips: {
          mode: 'index',
          intersect: true,
        },
        scales: {
          yAxes: [{
            // type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
            type: 'logarithmic',
            display: true,
            position: 'left',
            id: 'y-axis-1',
            ticks: {
              min: 0,
              autoskipping: true,
              display: true,
              maxTicksLimit: 7,
              callback(val) {
                return formatNumber(val, true, 0)
              },
              color: 'red',
            },
            offset: true,
            gridLines: {
              display: true,
              offsetGridLines: false,
            },
          }, {
            type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
            display: false,
            position: 'right',
            id: 'y-axis-2',
            gridLines: {
              drawOnChartArea: true,
            },
          }],
        },
      },
    }
  },
  computed: {
    calculateTotal() {
      let total = 0
      if (this.calculateByDenom.value) {
        Object.values(this.calculateByDenom.value).forEach(i => {
          total += i
        })
      }
      return numberWithCommas(parseFloat(total.toFixed(2)))
    },
    scatters() {
      const total = []
      if (this.calculateByDenom.qty) {
        Object.entries(this.calculateByDenom.qty).forEach(i => {
          const price = this.getPrice(i[0], 'usd')
          // x, y, circle
          total.push([Math.sqrt(i[1]), i[1] * price, price, i[0]])
        })
      }
      return total.sort((a, b) => b[2] - a[2])
    },
    calculateTotalChange() {
      let total = 0
      if (this.calculateByDenom.value) {
        Object.entries(this.calculateByDenom.value).forEach(i => {
          total += i[1] * this.getChanges(i[0]) * 0.01
        })
      }
      return parseFloat(total.toFixed(2))
    },
    calculateByDenom() {
      const v = Object.values(this.balances)
      const total = {}
      const qty = {}
      if (v) {
        v.forEach(tokens => {
          tokens.forEach(x => {
            const denom = this.formatDenom(x.denom)
            if (total[denom]) {
              total[denom] += this.formatCurrency(x.amount, x.denom)
            } else {
              total[denom] = this.formatCurrency(x.amount, x.denom)
            }
            if (qty[denom]) {
              qty[denom] += this.formatAmount(x.amount, x.denom, false)
            } else {
              qty[denom] = this.formatAmount(x.amount, x.denom, false)
            }
          })
        })
      }
      const d = Object.values(this.delegations)
      if (d) {
        d.forEach(tokens => {
          tokens.forEach(x => {
            const denom = this.formatDenom(x.denom)
            if (total[denom]) {
              total[denom] += this.formatCurrency(x.amount, x.denom)
            } else {
              total[denom] = this.formatCurrency(x.amount, x.denom)
            }
            if (qty[denom]) {
              qty[denom] += this.formatAmount(x.amount, x.denom, false)
            } else {
              qty[denom] = this.formatAmount(x.amount, x.denom, false)
            }
          })
        })
      }
      return { value: total, qty }
    },
    calculateChartDoughnut() {
      const total = this.calculateByDenom
      const labels = []
      const data = []
      Object.entries(total.value).sort((a, b) => b[1] - a[1]).forEach(i => {
        labels.push(i[0])
        data.push(i[1])
      })
      return {
        datasets: [
          {
            labels,
            data,
            backgroundColor: chartColors(),
            borderWidth: 0,
            pointStyle: 'rectRounded',
          },
        ],
      }
    },
  },
  created() {
    this.init()
  },
  methods: {
    refreshPrice() {
      this.$store.dispatch('chains/getQuotes')
    },
    init() {
      this.balances = {}
      this.delegations = {}
      this.accounts = getLocalAccounts()
      const chains = getLocalChains()
      if (this.accounts) {
        Object.keys(this.accounts).forEach(acc => {
          this.accounts[acc].address.forEach(add => {
            this.$http.getBankBalances(add.addr, chains[add.chain]).then(res => {
              const { balances } = res
              if (balances && balances.length > 0) {
                this.$set(this.balances, add.addr, balances)
                balances.forEach(token => {
                  if (token.denom.startsWith('ibc')) {
                    this.$http.getIBCDenomTrace(token.denom, chains[add.chain]).then(denom => {
                      this.$set(this.ibcDenom, token.denom, denom)
                    })
                  }
                })
              }
            })
            this.$http.getStakingDelegations(add.addr, chains[add.chain]).then(res => {
              if (res.delegation_responses) {
                const delegation = res.delegation_responses.map(x => x.balance).reduce((t, c) => {
                  const t1 = t
                  if (t1[c.denom]) {
                    t1[c.denom] += Number(c.amount)
                  } else {
                    t1[c.denom] = Number(c.amount)
                  }
                  return t1
                }, {})
                this.$set(this.delegations, add.addr, Object.keys(delegation).map(x => ({ amount: String(delegation[x]), denom: x })))
              }
            }).catch(() => { })
          })
        })
      }
    },
    setCurrency(c) {
      setUserCurrency(c)
      this.currency2 = c
      this.currency = getUserCurrencySign()
    },
    transfer(type, addr, chain) {
      this.operationModalType = type
      this.selectedAddress = addr
      this.selectedChainName = chain
    },
    completeAdd() {
      this.init()
      this.$bvModal.hide('add-account')
    },
    formatDenom(v) {
      if (!v) return ''
      const denom = (v.startsWith('ibc') ? this.ibcDenom[v] : v)
      return formatTokenDenom(denom)
    },
    formatTotalChange(v) {
      return numberWithCommas(v)
    },
    formatAmount(v, denom = 'uatom', format = true) {
      if (!v) return ''
      const denom2 = (denom.startsWith('ibc') ? this.ibcDenom[denom] : denom)
      return formatTokenAmount(v, 2, denom2, format)
    },
    formatAddr(v) {
      return v.substring(0, 10).concat('...', v.substring(v.length - 10))
    },
    formatCurrency(amount, denom) {
      const qty = this.formatAmount(amount, denom, false)
      return parseFloat((qty * this.getPrice(denom)).toFixed(2))
    },
    priceColor(denom) {
      const d2 = this.formatDenom(denom)
      const quote = this.$store.state.chains.quotes[d2]
      if (quote) {
        const price = quote[`${this.currency2}_24h_change`]
        return price > 0 ? 'text-success' : 'text-danger'
      }
      return ''
    },
    getPrice(denom, currency = null) {
      const d2 = this.formatDenom(denom)
      const quote = this.$store.state.chains.quotes[d2]
      return quote ? quote[currency || this.currency2 || 'usd'] || 0 : 0
    },
    getChanges(denom) {
      const d2 = this.formatDenom(denom)
      const quote = this.$store.state.chains.quotes[d2]
      if (quote) {
        const price = quote[`${this.currency2}_24h_change`]
        return price || 0
      }
      return 0
    },
    formatChanges(denom) {
      const price = this.getChanges(denom)
      if (price > 0) {
        return `+${parseFloat(price.toFixed(2))}%`
      }
      return '0'
    },
    formatPrice(denom) {
      const d2 = this.formatDenom(denom)
      const quote = this.$store.state.chains.quotes[d2]
      if (quote) {
        const price = quote[this.currency2]
        return price
      }
      return 0
    },
    formatBalance(v) {
      let total = 0
      const balance = this.balances[v]
      if (balance) {
        const ret = balance.map(x => this.formatCurrency(x.amount, x.denom)).reduce((t, c) => t + c)
        total += ret
      }
      const delegations = this.delegations[v]
      if (delegations) {
        const ret = delegations.map(x => this.formatCurrency(x.amount, x.denom)).reduce((t, c) => t + c, 0)
        total += ret
      }
      return numberWithCommas(parseFloat(total.toFixed(2)))
    },
    formatBalanceChanges(v) {
      let total = 0
      const balance = this.balances[v]
      if (balance) {
        const ret = balance.map(x => this.formatCurrency(x.amount, x.denom) * this.getChanges(x.denom) * 0.01).reduce((t, c) => t + c)
        total += ret
      }
      const delegations = this.delegations[v]
      if (delegations) {
        const ret = delegations.map(x => this.formatCurrency(x.amount, x.denom) * this.getChanges(x.denom) * 0.01).reduce((t, c) => t + c, 0)
        total += ret
      }
      return total > 0 ? `+${parseFloat(total.toFixed(2))}` : parseFloat(total.toFixed(2))
    },
    formatBalanceChangesColor(v) {
      const total = this.formatBalanceChanges(v)
      return total > 0 ? 'text-success' : 'text-danger'
    },
    removeAddress(v) {
      Object.keys(this.accounts).forEach(key => {
        const item = this.accounts[key]
        const newAddrs = item.address.filter(a => a.addr !== v)
        if (newAddrs.length > 0) {
          this.$delete(this.balances, v)
          this.$delete(this.delegations, v)
          this.$set(item, 'address', newAddrs)
          localStorage.setItem('accounts', JSON.stringify(this.accounts))
        } else {
          delete this.accounts[key]
          localStorage.setItem('accounts', JSON.stringify(this.accounts))
          this.init()
        }
      })
    },
    disconnect(key) {
      delete this.accounts[key]
      localStorage.setItem('accounts', JSON.stringify(this.accounts))
      this.init()
    },
    updateDefaultWallet(v) {
      this.$store.commit('setDefaultWallet', v)
    },
  },
}
</script>

<style lang="css">
.gradb {
  font-weight: 600;
  color: white !important;
  text-shadow: 1px 1px 3px 0px rgba(0, 0, 0, 0.8);
  background: -webkit-linear-gradient(235deg, #9a67f0 20%, #3Ba9DB 100%);

}

.gradt {
  font-weight: 500;
  text-shadow: 1px 1px 3px 0px rgba(0, 0, 0, 0.3);
  background: -webkit-linear-gradient(235deg, #9a67f0 20%, #3Ba9DB 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;

}

.gradbr {
  font-weight: 500;
  text-shadow: 1px 1px 3px 0px rgba(0, 0, 0, 0.3);
  background: -webkit-linear-gradient(235deg, #9a67f0 20%, #3Ba9DB 100%);
  -webkit-background-clip: text;
  background-clip: border;
  -webkit-text-fill-color: transparent;

}
</style>
