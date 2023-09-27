<template>
  <b-card no-body>
    <b-card-header>
      <h4 class="mb-0">
        Commission
      </h4>
      <b-card-text class="font-small-5 mb-0 text-muted">
        <small>
          <feather-icon icon="ClockIcon" />&nbsp;Updated at {{ dateFormat(data.update_time) }}
        </small>
      </b-card-text>
    </b-card-header>

    <!-- apex chart -->
    <vue-apex-charts type="radialBar" height="225" class="my-0 py-0" :options="goalOverviewRadialBar"
      :series="[percentFormat(data.rate)]" />
    <b-row class="text-center mx-0">
      <b-col md="4" style="border-right: 1px solid rgba(255,255,255,0.1);"
        class="d-flex align-items-between flex-column py-0">
        <small class="text-muted mb-1">
          Rate
        </small>
        <h3 class="font-weight-normal mb-1">
          {{ percentFormat(data.rate) }}%
        </h3>
      </b-col>

      <b-col md="4" class="d-flex align-items-between flex-column py-0">
        <small class="text-muted mb-1">
          Max Rate
        </small>
        <h3 class="font-weight-normal mb-1">
          {{ percentFormat(data.max_rate) }}%
        </h3>
      </b-col>

      <b-col md="4" style="border-left: 1px solid rgba(255,255,255,0.1);"
        class="d-flex align-items-between flex-column py-0">
        <small class="text-muted mb-1">
          Max Change Rate
        </small>
        <h3 class="font-weight-normal mb-1">
          {{ percentFormat(data.max_change_rate) }}%
        </h3>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
import {
  BCard, BCardHeader, BRow, BCol, BCardText,
} from 'bootstrap-vue'
import VueApexCharts from 'vue-apexcharts'
import { $themeColors } from '@themeConfig'
import { percent, toDay } from '@/libs/utils'

export default {
  components: {
    VueApexCharts,
    BCard,
    BCardHeader,
    BRow,
    BCardText,
    BCol,
  },
  props: {
    data: {
      type: Object,
      default: () => { },
    },
  },
  data() {
    return {
      goalOverviewRadialBar: {
        labels: ['Commission Rate'],
        chart: {
          height: 275,
          type: 'radialBar',
          sparkline: {
            enabled: false,
          },
        },
        colors: [$themeColors.primary],
        plotOptions: {
          track: {
            opacityTo: 0.5,
            background: '#333',
            opacityFrom: 0.3,
            strokeWidth: '67%',
          },
          labels: ['Commission Rate'],
          radialBar: {
            offsetY: 0,
            startAngle: -180,
            endAngle: 180,
            dataLabels: {
              total: {
                show: false,

              },
              value: {
                offsetY: '10px',
                fontSize: '24px',
                color: '#ccc',
              },
              name: {
                offsetY: '-10px',
                fontSize: '13px',
                color: '#777',
              },
            },
            hollow: {
              margin: 15,
              size: '70%',
              position: 'front',
              dropShadow: {
                enabled: true,
              },
            },
          },
        },
        fill: {
          type: 'gradient',
          background: '#000',
          gradient: {
            shade: 'dark',
            type: 'vertical',
            shadeIntensity: 1,
            gradientToColors: [$themeColors.info, $themeColors.primary],
            inverseColors: false,
            opacityFrom: 1,
            opacityTo: 0.9,
            stops: [0, 100],
          },
        },
        stroke: {
          background: '#000',
          lineCap: 'round',
        },
      },
    }
  },
  methods: {
    dateFormat(value) {
      return toDay(value)
    },
    percentFormat(value) {
      return percent(value)
    },
  },
}
</script>
