<template>
  <b-card
    v-if="data && data.items"
    no-body
  >
    <b-card-header style="
    background-color: rgba(0,0,0,0.18);
    border-bottom: 1px solid rgba(255,255,255,0.1);
    padding-top: 20px;
    padding-bottom:20px;">
      <b-card-title>{{ data.title }}&nbsp;&nbsp;<b-badge variant="light-warning">{{ data.items.length }}</b-badge></b-card-title>
    </b-card-header>
    <b-card-body class="statistics-body" style="
    padding-top: 20px;
    padding-bottom:15px;">
      <b-row>
        <b-col
          v-for="item in data.items"
          :key="item.icon"
          xl="3"
          md="6"
          sm="6"
          :class="item.customClass"
        >
          <div
            v-if="typeof item.title ==='object'"
          >
            <b-button
              :id="item.subtitle"
              variant="outline-primary"
              class="ml-2"
              size="sm"
            >
              {{ item.subtitle }}
            </b-button>
            <b-popover
              :target="item.subtitle"
              variant="primary"
              triggers="hover"
              placement="bottom"
            >
              <template #title>
                <span class="font-family-monospace text-lowercase">{{ item.subtitle }}</span>
              </template>
              <span>
                <array-field-component
                  v-if="Array.isArray(item.title)"
                  :tablefield="item.title"
                />
                <object-field-component
                  v-else
                  :tablefield="item.title"
                /></span>
            </b-popover>
          </div>
          <b-media
            v-else
            no-body
          >
            <b-media-aside
              class="mr-2"
            >
              <b-avatar
                v-if="item.icon"
                size="48"
                :variant="item.color? item.color : primary"
              >
                <feather-icon
                  size="24"
                  :icon="item.icon"
                />
              </b-avatar>
              <b-avatar
                v-else
                size="48"
                :variant="`light-${item.color? item.color : 'primary'}`"
              >
              <b-icon-info-circle/>
              </b-avatar>
            </b-media-aside>
            <b-media-body class="my-auto">
              <h4 class="font-weight-bolder mb-0">
                {{ item.title || '-' }}
              </h4>
              <b-card-text class="font-small-2 mb-1 text-lowercase">
                {{ item.subtitle }}
              </b-card-text>
            </b-media-body>
          </b-media>
        </b-col>
      </b-row>
    </b-card-body>
  </b-card>
</template>

<script>
import {
  BCard, BCardHeader, BCardTitle, BCardText, BCardBody, BRow, BCol, BMedia, BMediaAside, BAvatar, BBadge, BMediaBody, BPopover, BButton,
  BIconInfoCircle,
} from 'bootstrap-vue'
import ObjectFieldComponent from '../ObjectFieldComponent.vue'
import ArrayFieldComponent from '../ArrayFieldComponent.vue'

export default {
  components: {
    BRow,
    BCol,
    BIconInfoCircle,
    BBadge,
    BCard,
    BCardHeader,
    BCardTitle,
    BCardText,
    BCardBody,
    BMedia,
    BAvatar,
    BMediaAside,
    BMediaBody,
    BPopover,
    BButton,
    ObjectFieldComponent,
    ArrayFieldComponent,
  },
  props: {
    data: {
      type: [Object, Array],
      default: () => {},
    },
  },
}
</script>
