import store from '@/store'
import { getLocalAccounts, timeIn, toDay } from '@/libs/utils'

const data = {
  variant: 'success',
  tips: 'Synced',
  index: 0,
  chainid: '',
}
// const wallet = this.$store?.state?.chains?.defaultWallet || 'Wallet'
const { selected } = store.state.chains
const lschains = localStorage.getItem('chains')
// let conf = this.$store.state.chains.selected
// if (Array.isArray(conf.api)) conf = conf.api
// conf = [conf.api]
// const accounts = getLocalAccounts() || {}

export function processMenu() {
  const chainMenus = []
  const blockchains = []
  const links = []
  const wallet = []

  blockchains.push({
    title: 'OLLO Testnet',
    logo: '/ollo.png',
    tag: `${store.state.chains.config.ollo.sdk_version}`,
    route: { name: 'dashboard', params: { chain: 'ollo' } },
    tagVariant: 'light-primary',
  })
  Object.keys(store.state.chains.config).forEach(chain => {
    if (chain.chain_id !== 'ollo-testnet-1') {
      const menu = {
        title: chain,
        logo: store.state.chains.config[chain].logo,
        tag: `${store.state.chains.config[chain].sdk_version}`,
        route: { name: 'dashboard', params: { chain } },
        tagVariant: 'light-primary',
      }
      blockchains.push(menu)
    }
  })

  if (blockchains.length > 1) {
    chainMenus.push({ header: 'The Cosmos' })
    chainMenus.push({
      title: 'Networks',
      children: blockchains,
      tag: `${blockchains.length}`,
      tagVariant: 'primary',
      logo: 'MenuIcon',
      icon: 'MenuIcon',
    })
  }
  links.push({
    title: 'Overview',
    route: { name: 'chains' },
    icon: 'InfoIcon',
  })
  links.push({
    title: 'Explorers',
    route: { name: 'explorers' },
    icon: 'InfoIcon',
  })
  links.push({
    title: 'Github',
    href: 'https://github.com/OllO-Station',
    icon: 'GithubIcon',
  })
  links.push({
    title: 'Discord',
    href: 'https://discord.gg/euGcGgdq7M',
    icon: 'EyeIcon',
  })
  links.push({
    title: 'Twitter',
    href: 'https://twitter.com/OLLOStation',
    icon: 'TwitterIcon',
  })
  links.push({
    title: 'Docs',
    href: 'https://docs.ollo.zone',
    icon: 'InfoIcon',
  })

  chainMenus.push({ header: 'Wallet' })
  wallet.push({
    title: 'Accounts',
    route: { name: 'wallet' },
    icon: 'UsersIcon',
  })
  wallet.push({
    title: 'Import',
    route: { name: 'import' },
    icon: 'InfoIcon',
  })
  wallet.push({
    title: 'Transactions',
    route: { name: 'mytransactions' },
    icon: 'InfoIcon',
  })
  wallet.push({
    title: 'Delegations',
    route: { name: 'delegations' },
    icon: 'InfoIcon',
  })
  wallet.push({
    title: 'Votes',
    route: { name: 'myvotes' },
    icon: 'InfoIcon',
  })
  wallet.push({
    title: 'Settings',
    route: { name: 'wallet-settings' },
    icon: 'SettingsIcon',
  })
  chainMenus.push({
    title: 'Wallet',
    children: wallet,
    logo: 'ShieldIcon',
    tag: `${selected.chain_name}`,
    tagVariant: 'primary',
  })
  chainMenus.push({ header: 'Resources' })
  chainMenus.push({
    title: 'Links',
    children: links,
    logo: 'MenuIcon',
    tag: `${links.length}`,
    tagVariant: 'primary',
  })
  // chainMenus.push({ header: '' })
  return chainMenus
}

export default processMenu()
