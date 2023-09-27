import { useUtils as useAclUtils } from '@core/libs/acl'

// const { t } = useI18nUtils()
const { canViewVerticalNavMenuHeader } = useAclUtils()

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  render(h) {
    const logo = this.item.icon || 'MoreHorizontalIcon'
    const span = h('span', { style: 'text-transform: uppercase;' }, this.item.header)
    const icon = h('feather-icon', { props: { icon: this.item.icon || 'MoreHorizontalIcon', size: '18' } })
    if (canViewVerticalNavMenuHeader(this.item)) {
      return h('li', { class: 'navigation-header text-truncate' }, [span, icon])
    }
    return h()
  },
}
