<template>
  <Scatter
    :chart-options="chartOptions"
    :chart-data="data"
    :css-classes="cssClasses"
    :styles="styles"
    :width="width"
    :height="height"
  />
</template>

<script>
import { percent } from '@/libs/utils'
import { Scatter, mixins } from 'vue-chartjs'
import { $themeColors } from '@themeConfig'

export default {
  name: 'ScatterChart',
  components: {
    Scatter,
  },
  props: {
    width: {
      type: Number,
      default: 400,
    },
    height: {
      type: Number,
      default: 400,
    },
    cssClasses: {
      default: '',
      type: String,
    },
    styles: {
      type: Object,
      default: () => {},
    },
    data: {
      type: Object,
      required: true,
    },
    options: {
      type: Object,
      default: () => {
        // responsive: true,
        // maintainAspectRatio: false,
      },

    },
  },
  data() {
    return {
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        responsiveAnimationDuration: 500,
        cutoutPercentage: 60,
        legend: {
          display: true,
          title: {
            display: true,
          },
        },
        tooltips: {
          callbacks: {
            label(tooltipItem, data) {
              const label = data.datasets[0].labels[tooltipItem.index] || ''
              const value = data.datasets[0].data[tooltipItem.index]
              const total = data.datasets[0].data.reduce((t, c) => t + c)
              const output = ` ${label} : ${percent(value / total)} %`
              return output
            },
          },
          // Updated default tooltip UI
          shadowOffsetX: 1,
          shadowOffsetY: 1,
          shadowBlur: 8,
          // shadowColor: chartColors.tooltipShadow,
          backgroundColor: $themeColors.light,
          titleFontColor: $themeColors.dark,
          bodyFontColor: $themeColors.dark,
        },
      },
    }
  },
}
</script>
