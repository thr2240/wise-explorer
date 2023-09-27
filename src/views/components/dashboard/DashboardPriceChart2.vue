<template>
  <b-card border-variant="primary" v-if="marketData && marketData.prices">
    <b-row>
      <b-col md="4">
        <div class="d-flex flex-column">
          <h2 class="font-weight-bold">
            {{ coinInfo.name }}&nbsp;&nbsp;&nbsp;<b-badge variant="light-primary"
              class="px-1 text-uppercase text-warning font-weight-bolder">{{ coinInfo.symbol }}</b-badge>&nbsp;
            <span style="color: dimgray;" size="sm">
              <b-badge v-b-tooltip.bottom.hover v-b-tooltip.bottom.hover.v-dark title="Coingecko rank"
                variant="light-info">
                #{{ coinInfo.coingecko_rank }}
              </b-badge>
            </span>
          </h2>
        </div>
        <hr>
        <div class="my-1">
          <b-badge v-for="tag in coinInfo.categories" :key="tag" variant="light-info" style="margin: 2px;">
            {{ tag }}
          </b-badge>
          <br />
        </div>
        <div>
          <div v-if="coinInfo.description && coinInfo.description.en">
            {{ coinInfo.description.en || '' }}
          </div>
          <!-- buy  -->
          <div class="rounded d-flex justify-content-between p-2" style="margin-top: 10px; "
            :class="`bg-light-primary`">
            <b-dropdown id="dropdown-3" size="sm" text="Pairs" variant="primary">
              <b-dropdown-header>
                <span class="text-primary font-weight-bolder">{{ tickers.length }}</span> pairs
              </b-dropdown-header>
              <vue-perfect-scrollbar :settings="settings" class="pair-scroll-area">
                <b-dropdown-item v-for="(pair, i) in tickers" :key="i" @click="selectPair(pair)">
                  <b-row style="width:400px;">
                    <b-col cols="4" class="text-truncate">
                      {{ pair.market.name }}
                    </b-col>
                    <b-col cols="4" class="font-weight-bold" :class="`text-${colorMap(pair.trust_score)}`">
                      ${{ pair.converted_last.usd }}
                    </b-col>
                    <b-col v-b-tooltip.left cols="4" class="text-uppercase text-truncate"
                      :title="`${pair.base}/${pair.target}`">
                      {{ pair.base }}/{{ pair.target }}
                    </b-col>
                  </b-row>
                </b-dropdown-item>
              </vue-perfect-scrollbar>
            </b-dropdown>
            <div class="text-truncate ml-1">
              <sup class="text-body">
                <small>$</small>
              </sup>
              <h2 class="gradt d-inline mr-25">
                {{ selectedTicker.converted_last.usd || '-' }}
              </h2>
              <sub class="text-body"><small>USD</small></sub>
            </div>
          </div>
          <!--/ buy  -->
          <b-button block variant="link" class="mt-1 mb-2 gradb font-weight-bold text-white"
            :href="selectedTicker.trade_url">
            Buy {{ String(coinInfo.symbol).toUpperCase() }}
          </b-button>
        </div>
      </b-col>
      <b-col md="8">
        <b-card-header class="d-flex justify-content-between px-0">
          <!-- size -->
          <b-button-group style="padding-left: 50px;" size="sm">
            <b-button style="font-color: white;" :variant="type==='prices'? 'info': 'outline-info'"
              @click="selectChart('prices')">
              Price
            </b-button>
            <b-button style="font-color: white;" :variant="type != 'prices'? 'info': 'outline-info'"
              @click="selectChart('total_volumes')">
              Volume
            </b-button>
          </b-button-group>
          <!-- size -->
          <b-button-group size="sm">
            <!-- <b-button -->
            <!--   :variant="days===1? 'info': 'outline-dark'" -->
            <!--   @click="selectDays(1)" -->
            <!-- > -->
            <!--   Daily -->
            <!-- </b-button> -->
            <!-- <b-button -->
            <!--   :variant="days===7? 'info': 'outline-dark'" -->
            <!--   @click="selectDays(7)" -->
            <!-- > -->
            <!--   Weekly -->
            <!-- </b-button> -->
            <!-- <b-button -->
            <!--   :variant="days===30? 'dark': 'outline-dark'" -->
            <!--   @click="selectDays(30)" -->
            <!-- > -->
            <!--   Monthly -->
            <!-- </b-button> -->
            <b-button :variant="days===1? 'primary': 'outline-primary'" @click="selectDays(1)">
              Daily
            </b-button>
            <b-button :variant="days===7? 'primary': 'outline-primary'" @click="selectDays(7)">
              Weekly
            </b-button>
            <b-button :variant="days===30? 'primary': 'outline-primary'" @click="selectDays(30)">
              Monthly
            </b-button>
          </b-button-group>
        </b-card-header>

        <b-card-body class="p-0">
          <!-- apex chart -->
          <vue-apex-charts type="line" height="320" :options="chartOptions" :series="series" />
        </b-card-body>
      </b-col>
    </b-row>
    <b-card-footer class="px-0">
      <div class="mt-1">
        <b-button :href="homepage" class="mr-1" variant="link-info"
          style="border: 1px solid rgba(255,255,255,0.2); opacity: 0.95;" size="sm">
          <feather-icon icon="CastIcon" /> Website
        </b-button>
        <b-button :href="twitter" class="mr-1" variant="link-info"
          style="border: 1px solid rgba(255,255,255,0.2); opacity: 0.95;" size="sm">
          <feather-icon icon="TwitterIcon" /> Twitter
        </b-button>
        <b-button :href="github" class="mr-1" variant="link-info"
          style="border: 1px solid rgba(255,255,255,0.2); opacity: 0.95;" size="sm">
          <feather-icon icon="GithubIcon" /> Github
        </b-button>
        <b-button :href="discord" class="mr-1" variant="link-info"
          style="border: 1px solid rgba(255,255,255,0.2); opacity: 0.95;" size="sm">
          <feather-icon icon="MessageSquareIcon" /> Discord
        </b-button>
        <b-button :href="telegram" class="mr-1" variant="link-info"
          style="border: 1px solid rgba(255,255,255,0.2); opacity: 0.95;" size="sm">
          <feather-icon icon="SendIcon" /> Telegram
        </b-button>
        <b-dropdown v-if="coinInfo.links && coinInfo.links.blockchain_site" id="dropdown-2" size="sm" text="Explorers"
          noCaret
          style="color: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.2); z-index: 100; opacity: 0.95;"
          variant="link-info">
          <template #button-content>
            Explorers
            <feather-icon icon="MoreVerticalIcon" />
          </template>
          <b-dropdown-item v-for="site in coinInfo.links.blockchain_site.filter(x => x)" :key="site" :href="site">{{
          site }}</b-dropdown-item>
        </b-dropdown>
      </div>
    </b-card-footer>
  </b-card>
</template>

<script>
import {
  BCard, BCardHeader, BCardTitle, BCardBody, BCardText, BFormRadio, BButton, BButtonGroup, BCol, BRow,
  BCardFooter, BBadge, VBTooltip, BDropdown, BDropdownItem, BDropdownHeader,
} from 'bootstrap-vue'
import VueApexCharts from 'vue-apexcharts'
import { $themeColors } from '@themeConfig'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import FeatherIcon from '../../../@core/components/feather-icon/FeatherIcon.vue'

export default {
  components: {
    VueApexCharts,
    BCard,
    BCardHeader,
    BCardText,
    BCardTitle,
    BCardBody,
    BFormRadio,
    BButton,
    BButtonGroup,
    BCol,
    BRow,
    BCardFooter,
    BBadge,
    BDropdown,
    BDropdownItem,
    BDropdownHeader,
    FeatherIcon,
    VuePerfectScrollbar,
  },
  directives: {
    'b-tooltip': VBTooltip,
  },
  data() {
    return {
      settings: {
        maxScrollbarLength: 60,
      },
      colors: {
        green: 'success',
        yellow: 'warning',
      },
      coinInfo: {},
      type: 'prices',
      days: 30,
      tickers: [],
      selectedTicker: {
        converted_last: {},
      },
      marketData: {
        prices: [],
        volumes: [],
      },
      chartOptions: {
        chart: {
          type: 'area',
          brush: {
          },
          sparkline: {

          },
          plotOptions: {

          },
          animations: {
            enabled: true,
          },
          toolbar: {
            show: false,
            autoSelected: 'zoom',
          },
          foreColor: '#656',
          zoom: { enabled: true },
          dropShadow: {
            enabled: false,
            top: 18,
            left: 2,
            blur: 5,
            opacity: 0.2,
          },
          offsetX: -0,
        },
        stroke: {
          curve: 'smooth',
          lineCap: 'round',
          width: 3,
        },
        grid: {
          borderColor: '#393939',
          clipMarkers: false,
          row: {
            opacity: 0.3,

          },
          column: {
            opacity: 0.3,

          },
          yaxis: {
            lines: { show: true },
          },
          xaxis: {
            lines: { show: false },

          },
          padding: {
            top: 0,
            bottom: 0,
            left: 0,
          },
        },
        legend: {
          show: true,
        },
        theme: {
          mode: 'dark',

        },
        colors: [$themeColors.primary],
        fill: {
          type: 'gradient',
          colors: [$themeColors.primary],
          gradient: {
            shade: 'primary',
            inverseColors: false,
            gradientToColors: [$themeColors.info, $themeColors.primary],
            shadeIntensity: 1.0,
            type: 'vertical',
            opacityFrom: 0.80,
            opacityTo: 0.0,
            stops: [0, 98],
          },
        },
        markers: {
          size: 0,
          strokeWidth: 3,
          hover: {
            size: 4,
          },
        },
        xaxis: {
          type: 'datetime',
          colors: ['#aaa'],
          tickAmount: 6,
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: true,
            color: '#999',
          },
          tooltip: {
            enabled: true,
            theme: 'dark',
          },
          labels: {
            colors: '#555',
            fontSize: '0.857rem',
          },
        },
        yaxis: {
          tickAmount: 4,
          labels: {
            style: {
              colors: '#555',
              fontSize: '0.857rem',
            },
            formatter(val) {
              if (val > 999999999) {
                return `${(val / 1000000000).toFixed()}b`
              }
              if (val > 999999) {
                return `${(val / 1000000).toFixed()}m`
              }
              if (val > 999) {
                return `${(val / 1000).toFixed()}k`
              }
              if (val > 1) {
                return parseFloat(val.toFixed(3)).toString()
              }
              return parseFloat(val.toFixed(6)).toString()
            },
          },
        },
        tooltip: {
          fillSeriesColor: false,
          theme: 'dark',
          x: { show: true },
        },
      },
    }
  },
  computed: {
    series() {
      return [
        {
          type: 'area',
          name: this.type,
          data: this.marketData[this.type].map(x => ({ x: x[0], y: x[1] })),
        },
      ]
    },
    color() {
      return this.colorMap(this.selectedTicker?.trust_score)
    },
    homepage() {
      if (this.coinInfo.links) {
        return this.coinInfo.links.homepage[0] || '#'
      }
      return '#'
    },
    twitter() {
      if (this.coinInfo.links) {
        return this.coinInfo.links.twitter_screen_name ? `https://twitter.com/${this.coinInfo.links.twitter_screen_name}` : '#'
      }
      return '#'
    },
    discord() {
      if (this.coinInfo.links) {
        const discordLink = this.coinInfo.links.chat_url.filter(x => x.includes('discord'))
        if (discordLink) {
          return discordLink ? `${discordLink}` : '#'
        }
      }
      return '#'
    },
    telegram() {
      if (this.coinInfo.links) {
        return this.coinInfo.links.telegram_channel_identifier ? `https://t.me/${this.coinInfo.links.telegram_channel_identifier}` : '#'
      }
      return '#'
    },
    github() {
      if (this.coinInfo.links) {
        return this.coinInfo.links.repos_url.github[0] || '#'
      }
      return '#'
    },
  },
  created() {
    this.$http.getMarketChart(this.days).then(res => {
      this.marketData = res
    }).catch(() => {
      this.marketData = null
    })
    this.$http.getCoinInfo().then(res => {
      if (res) {
        this.coinInfo = res
        this.tickers = res.tickers
        if (this.tickers.length > 0) {
          // eslint-disable-next-line prefer-destructuring
          this.selectedTicker = this.tickers[0]
        }
      }
    })
  },
  methods: {
    colorMap(v) {
      return this.colors[v] || 'secondary'
    },
    selectChart(v) {
      this.type = v
    },
    selectDays(v) {
      this.days = v
      this.$http.getMarketChart(this.days).then(res => {
        this.marketData = res
      })
    },
    selectPair(v) {
      this.selectedTicker = v
    },
    url(which) {
      return this.coinInfo[which][0] || '#'
    },
  },
}
</script>

<style lang="scss" scoped>
.pair-scroll-area {
  position: relative;
  margin: auto;
  /* width: 400px; //*/
  max-height: 300px;
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

b-button {
  box-shadow: none !important;
}
</style>
