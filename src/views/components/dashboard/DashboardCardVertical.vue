<template>
  <b-card class="text-center" style="
">
    <b-avatar class="mb-1 shadow-lg" :variant="`light-${color}`" size="45">
      <feather-icon size="24" :icon="icon" />
    </b-avatar>
    <div class="truncate">
      <h4 class="mb-25 font-weight-bolder">
        {{ statistic }}
      </h4>
      <small class="stitle">{{ statisticTitle }}</small>
    </div>
  </b-card>
</template>

<script>
import { BCard, BAvatar } from 'bootstrap-vue'

export default {
  components: {
    BCard,
    BAvatar,
  },
  props: {
    icon: {
      type: String,
      required: true,
    },
    statistic: {
      type: [Number, String],
      required: true,
    },
    statisticTitle: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: 'primary',
    },
  },
}
</script>
<style>
.stitle {}
</style>
