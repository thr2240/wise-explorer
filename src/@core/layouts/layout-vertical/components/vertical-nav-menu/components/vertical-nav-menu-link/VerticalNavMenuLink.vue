<template>
  <li v-if="canViewVerticalNavMenuLink(item)" class="nav-item" :class="{
    'active': isActive,
    'disabled': item.disabled
  }">
    <b-link v-bind="linkProps" class="d-flex align-items-center">
      <b-avatar v-if="item.logo || item.icon" variant="transparent" :src="item.logo || item.icon" icon="people"
        size="sm" class="mr-1" />
      <feather-icon v-else :icon="item.icon || 'ChevronRightIcon'" />
      <span class="text-truncate text-capitalize">{{ item.title }}</span>
      <b-badge v-if="item.tag" pill :variant="item.tagVariant || 'primary'" class="mr-1 ml-auto">
        {{ item.tag }}
      </b-badge>
    </b-link>
  </li>
</template>

<script>
import { useUtils as useAclUtils } from '@core/libs/acl'
import { BLink, BBadge, BAvatar } from 'bootstrap-vue'
import useVerticalNavMenuLink from './useVerticalNavMenuLink'
import mixinVerticalNavMenuLink from './mixinVerticalNavMenuLink'

export default {
  components: {
    BLink,
    BBadge,
    BAvatar,
  },
  mixins: [mixinVerticalNavMenuLink],
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { isActive, linkProps, updateIsActive } = useVerticalNavMenuLink(props.item)
    const { canViewVerticalNavMenuLink } = useAclUtils()

    return {
      isActive,
      linkProps,
      updateIsActive,

      // ACL
      canViewVerticalNavMenuLink,

      // i18n
    }
  },

}
</script>
