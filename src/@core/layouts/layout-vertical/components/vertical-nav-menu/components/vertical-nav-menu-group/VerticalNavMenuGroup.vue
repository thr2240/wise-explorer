<template>
  <li v-if="canViewVerticalNavMenuGroup(item)" class="nav-item has-sub" :class="{
    'open': isOpen,
    'disabled': item.disabled,
    'sidebar-group-active': isActive,
  }">
    <b-link class="d-flex align-items-center" @click="() => updateGroupOpen(!isOpen)">
      <b-avatar v-if="item.logo" variant="transparent" :src="item.logo" size="sm" class="mr-1" />
      <b-avatar v-else variant="transparent" src="LinkIcon" size="16" class="mr-1 ml-1" />
      <!-- <feather-icon -->
      <!--   :icon="item.icon || 'LinkIcon'" -->
      <!-- /> -->

      <span class="menu-title text-truncate font-family-monospace text-uppercase"
        style="text-rendering: optimizeLegibility; text-shadow: 1px 1px 2px 1px rgba(0,0,0,0.2);">{{ item.title
        }}</span>
      <b-badge v-if="item.tag" size="sm" pill :variant="item.tagVariant || 'primary'" class="mr-1 ml-auto gradb">
        {{ item.tag }}
      </b-badge>
    </b-link>
    <b-collapse v-model="isOpen" class="menu-content" tag="ul">
      <component :is="resolveNavItemComponent(child)" v-for="child in item.children" :key="child.header || child.title"
        ref="groupChild" :item="child" />
    </b-collapse>
  </li>
</template>

<script>
import {
  BLink, BBadge, BCollapse, BAvatar,
} from 'bootstrap-vue'
import { resolveVerticalNavMenuItemComponent as resolveNavItemComponent } from '@core/layouts/utils'
import { useUtils as useAclUtils } from '@core/libs/acl'
import VerticalNavMenuHeader from '../vertical-nav-menu-header'
import VerticalNavMenuLink from '../vertical-nav-menu-link/VerticalNavMenuLink.vue'

// Composition Function
import useVerticalNavMenuGroup from './useVerticalNavMenuGroup'
import mixinVerticalNavMenuGroup from './mixinVerticalNavMenuGroup'

export default {
  name: 'VerticalNavMenuGroup',
  components: {
    VerticalNavMenuHeader,
    VerticalNavMenuLink,
    BAvatar,
    BLink,
    BBadge,
    BCollapse,
  },
  mixins: [mixinVerticalNavMenuGroup],
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const {
      isOpen,
      isActive,
      updateGroupOpen,
      updateIsActive,
    } = useVerticalNavMenuGroup(props.item)

    const { canViewVerticalNavMenuGroup } = useAclUtils()

    return {
      resolveNavItemComponent,
      isOpen,
      isActive,
      updateGroupOpen,
      updateIsActive,

      // ACL
      canViewVerticalNavMenuGroup,

    }
  },
}
</script>

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
