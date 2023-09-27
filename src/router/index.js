import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/wallet',
      alias: ['/wallet/accounts', '/accounts'],
      name: 'wallet',
      component: () => import('@/views/Wallet.vue'),
      meta: {
        pageTitle: 'Wallet',
        breadcrumb: [
          {
            text: 'Wallet',
            to: { name: 'wallet' },
            active: true,
          },
        ],
      },
    },
    {
      path: '/wallet/importx',
      name: 'importx',
      component: () => import('@/views/wallet/Importx.vue'),
      meta: {
        pageTitle: 'Wallet Importx',
        breadcrumb: [
          {
            text: 'Wallet',
            to: { name: 'wallet' },
            active: false,
          },
          {
            text: 'Importx',
            to: '/wallet/importx',
            active: true,
          },
        ],
      },
    },
    {
      path: '/wallet/import',
      name: 'import',
      component: () => import('@/views/wallet/Import.vue'),
      meta: {
        pageTitle: 'Wallet Import',
        breadcrumb: [
          {
            text: 'Wallet',
            to: { name: 'wallet' },
            active: false,
          },
          {
            text: 'Import',
            to: '/wallet/import',
            active: true,
          },
        ],
      },
    },
    {
      path: '/wallet/delegations',
      name: 'delegations',
      component: () => import('@/views/wallet/Delegations.vue'),
      meta: {
        pageTitle: 'Delegations',
        breadcrumb: [
          {
            text: 'Wallet',
            to: { name: 'wallet' },
            active: false,
          },
          {
            text: 'Delegations',
            to: '/wallet/delegations',
            active: true,
          },
        ],
      },
    },
    {
      path: '/wallet/transactions',
      name: 'mytransactions',
      component: () => import('@/views/wallet/Transactions.vue'),
      meta: {
        pageTitle: 'Transactions',
        breadcrumb: [
          {
            text: 'Wallet',
            to: { name: 'wallet' },
            active: false,
          },
          {
            text: 'Transactions',
            to: { name: 'mytransactions' },
            active: true,
          },
        ],
      },
    },
    {
      path: '/wallet/votes',
      name: 'myvotes',
      component: () => import('@/views/wallet/Votes.vue'),
      meta: {
        pageTitle: 'Votes',
        breadcrumb: [
          {
            text: 'Wallet',
            to: { name: 'wallet' },
            active: false,
          },
          {
            text: 'Votes',
            active: true,
            to: { name: 'myvotes' },
          },
        ],
      },
    },
    {
      path: '/wallet/settings',
      name: 'wallet-settings',
      component: () => import('@/views/wallet/Settings.vue'),
      meta: {
        pageTitle: 'Wallet Settings',
        breadcrumb: [
          {
            text: 'Wallet',
            to: { name: 'wallet' },
            active: false,
          },
          {
            text: 'Settings',
            to: '/wallet/settings',
            active: true,
          },
        ],
      },
    },
    {
      path: '/chains',
      name: 'chains',
      alias: '/networks',
      component: () => import('@/views/Chains.vue'),
      meta: {
        pageTitle: 'Chains',
        breadcrumb: [
          {
            text: 'Chains',
            to: { name: 'chains' },
            active: true,
          },
        ],
      },
    },
    // OLLO Modules
    {
      path: '/',
      redirect: '/ollo',
    },
    {
      path: '/params',
      redirect: '/ollo/params',
    },
    {
      path: '/params/statesync',
      redirect: '/ollo/params/statesync',
    },
    {
      path: '/validators/uptime',
      redirect: '/ollo/validators/uptime',
    },
    {
      path: '/validators/uptime/my',
      redirect: '/ollo/validators/uptime/my',
    },
    {
      path: '/wallet/:address',
      name: 'wallet-account',
      component: () => import('@/views/Account.vue'),
      meta: {
        pageTitle: 'Account',
        breadcrumb: [
          {
            text: 'Wallet',
            to: { name: 'wallet' },
            active: false,
          },
          {
            text: 'Account',
            to: { name: 'wallet-account' },
            active: true,
          },
        ],
      },
    },
    {
      path: '/wallet/:address/receive',
      name: 'wallet-receive',
      component: () => import('@/views/wallet/Receive.vue'),
      meta: {
        pageTitle: 'Receive',
        breadcrumb: [
          {
            text: 'Wallet',
            to: { name: 'wallet' },
            active: false,
          },
          {
            text: 'Receive',
            to: { name: 'wallet-receive' },
            active: true,
          },
        ],
      },
    },
    {
      path: '/validators',
      redirect: '/ollo/validators',
    },
    {
      path: '/validators/:address',
      redirect: '/ollo/validators/:address',
    },
    {
      path: '/gov',
      redirect: '/ollo/gov',
    },
    {
      path: '/gov/:proposalid',
      redirect: '/ollo/gov/:proposalid',
    },
    {
      path: '/blocks',
      redirect: '/ollo/blocks',
    },
    {
      path: '/blocks/:height',
      redirect: '/ollo/blocks/:height',
    },
    {
      path: '/tx',
      redirect: '/ollo/tx',
    },
    {
      path: '/tx/:hash',
      redirect: '/ollo/tx/:hash',
    },
    // 2. OSMOSIS
    {
      path: '/:chain/osmosis/trade/:poolid?',
      name: 'osmosis-trade',
      component: () => import('@/views/OsmosisTrade.vue'),
      meta: {
        pageTitle: 'Classic Trade',
        breadcrumb: [
          {
            text: 'Trade',
            to: { name: 'osmosis-trade' },
            active: true,
          },
          {
            text: 'Pool ID',
            to: { name: 'osmosis-trade' },
            active: true,
          },
        ],
      },
    },
    {
      path: '/:chain/account/:address',
      name: 'chain-account',
      component: () => import('@/views/Account.vue'),
      meta: {
        pageTitle: 'Account',
        breadcrumb: [
          {
            text: 'Account',
            to: { name: 'chain-account' },
            active: true,
          },
        ],
      },
    },
    {
      path: '/:chain/account/:address/receive',
      name: 'chain-receive',
      component: () => import('@/views/wallet/Receive.vue'),
      meta: {
        pageTitle: 'Receive',
        breadcrumb: [
          {
            text: 'Account',
            to: { name: 'chain-account' },
            active: false,
          },
          {
            text: 'Receive',
            to: { name: 'chain-receive' },
            active: true,
          },
        ],
      },
    },
    // common modules
    {
      path: '/validators/consensus',
      redirect: '/ollo/validators/consensus',
    },
    // chain modules
    {
      path: '/:chain/',
      name: 'dashboard',
      alias: '/:chain',
      component: () => import('@/views/Dashboard.vue'),
      meta: {
        pageTitle: 'Dashboard',
        breadcrumb: [
          {
            text: 'Dashboard',
            to: { name: 'dashboard' },
            active: true,
          },
        ],
      },
    },
    {
      path: '/:chain/ibc',
      name: 'ibc',
      component: () => import('@/views/IBC.vue'),
      meta: {
        pageTitle: 'IBC',
        breadcrumb: [
          {
            text: 'IBC',
            to: { name: 'ibc' },
            active: true,
          },
        ],
      },
    },
    {
      path: '/:chain/params',
      name: 'parameters',
      component: () => import('@/views/Parameters.vue'),
      meta: {
        pageTitle: 'Parameters',
        breadcrumb: [
          {
            text: 'Parameters',
            to: { name: 'parameters' },
            active: true,
          },
        ],
      },
    },
    {
      path: '/:chain/params/modules',
      name: 'modules',
      component: () => import('@/views/params/Modules.vue'),
      meta: {
        pageTitle: 'Modules',
        breadcrumb: [
          {
            text: 'Parameters',
            to: { name: 'parameters' },
            active: false,
          },
          {
            text: 'Modules',
            to: { name: 'parameters' },
            active: true,
          },
        ],
      },
    },
    {
      path: '/:chain/params/statesync',
      name: 'statesync',
      component: () => import('@/views/params/StateSync.vue'),
      meta: {
        pageTitle: 'State Sync',
        breadcrumb: [
          {
            text: 'Parameters',
            to: { name: 'parameters' },
            active: false,
          },
          {
            text: 'State Sync',
            to: { name: 'statesync' },
            active: true,
          },
        ],
      },
    },
    {
      path: '/:chain/validators/uptime',
      name: 'uptime',
      component: () => import('@/views/validators/Uptime.vue'),
      meta: {
        pageTitle: 'Uptime',
        breadcrumb: [
          {
            text: 'Validators',
            to: { name: 'validators' },
            active: false,
          },
          {
            text: 'Uptime',
            to: { name: 'uptime' },
            active: true,
          },
        ],
      },
    },
    {
      path: '/:chain/validators/uptime/my/blocks',
      name: 'myuptimeblocks',
      component: () => import('@/views/validators/uptime/Blocks.vue'),
      meta: {
        pageTitle: 'Uptime Blocks',
        breadcrumb: [
          {
            text: 'Validators',
            to: { name: 'validators' },
            active: false,
          },
          {
            text: 'Uptime',
            to: '/:chain/validators/uptime',
            active: false,
          },
          {
            text: 'My Blocks',
            to: '/:chain/validators/uptime/my/blocks',
            active: true,
          },
        ],
      },
    },
    {
      path: '/:chain/validators/uptime/my',
      name: 'myuptimevalidators',
      component: () => import('@/views/validators/uptime/Validators.vue'),
      meta: {
        pageTitle: 'Uptime Validators',
        breadcrumb: [
          {
            text: 'Validators',
            to: { name: 'validators' },
            active: false,
          },
          {
            text: 'Uptime',
            to: '/:chain/validators/uptime',
            active: false,
          },
          {
            text: 'My Validators',
            to: '/:chain/validators/uptime/my/validators',
            active: true,
          },
        ],
      },
    },
    {
      path: '/:chain/gov',
      name: 'governance',
      component: () => import('@/views/Governance.vue'),
      meta: {
        pageTitle: 'Governance',
        breadcrumb: [
          {
            text: 'Governance',
            to: { name: 'governance' },
            active: true,
          },
        ],
      },
    },
    {
      path: '/:chain/gov/:proposalid',
      name: 'proposal',
      component: () => import('@/views/gov/Proposal.vue'),
      meta: {
        pageTitle: 'Proposal',
        breadcrumb: [
          {
            text: 'Governance',
            to: { name: 'governance' },
            active: false,
          },
          {
            text: 'Proposal',
            to: { name: 'proposal' },
            active: true,
          },
        ],
      },
    },
    {
      path: '/:chain/blocks',
      name: 'blocks',
      component: () => import('@/views/Blocks.vue'),
      meta: {
        pageTitle: 'Blocks',
        breadcrumb: [
          {
            text: 'Blocks',
            to: { name: 'blocks' },
            active: true,
          },
        ],
      },
    },
    {
      path: '/:chain/blocks/:height',
      name: 'block',
      component: () => import('@/views/blocks/Block.vue'),
      meta: {
        pageTitle: 'Block',
        breadcrumb: [
          {
            text: 'Blocks',
            to: { name: 'blocks' },
            active: false,
          },
          {
            text: 'Block',
            active: true,
            to: { name: 'block' },
          },
        ],
      },
    },
    {
      path: '/:chain/txs',
      name: 'transactions',
      component: () => import('@/views/Transactions.vue'),
      meta: {
        pageTitle: 'Transactiosn',
        breadcrumb: [
          {
            text: 'Transactions',
            to: { name: 'transactions' },
            active: true,
          },
        ],
      },
    },
    {
      path: '/:chain/tx/:hash',
      name: 'transaction',
      component: () => import('@/views/txs/Transaction.vue'),
      meta: {
        pageTitle: 'Transaction',
        breadcrumb: [
          {
            text: 'Transactions',
            to: { name: 'blocks' },
            active: false,
          },
          {
            text: 'Transaction',
            to: { name: 'transaction' },
            active: true,
          },
        ],
      },
    },
    // custom modules for specified chains
    // 1. cosmos
    {
      path: '/:chain/cosmos/trade',
      name: 'gravity',
      component: () => import('@/views/GravityPool.vue'),
      meta: {
        pageTitle: 'Gravity Pools',
        breadcrumb: [
          {
            text: 'Gravity',
            to: '/:chain/cosmos/trade',
            active: true,
          },
        ],
      },
    },
    // common modules
    {
      path: '/:chain/validators',
      name: 'validators',
      component: () => import('@/views/Validators.vue'),
      meta: {
        pageTitle: 'Validators',
        breadcrumb: [
          {
            text: 'Validators',
            to: { name: 'validators' },
            active: true,
          },
        ],
      },
    },
    {
      path: '/:chain/validators/consensus',
      name: 'consensus',
      component: () => import('@/views/validators/Consensus.vue'),
      meta: {
        pageTitle: 'Consensus',
        breadcrumb: [
          {
            text: 'Validators',
            to: { name: 'validators' },
            active: false,
          },
          {
            text: 'Consensus',
            to: '/:chain/validators/consensus',
            active: true,
          },
        ],
      },
    },
    {
      path: '/:chain/validators/:address',
      name: 'validator',
      alias: '/ollo/validators/:address',
      component: () => import('@/views/validators/Validator.vue'),
      meta: {
        pageTitle: 'Validator',
        breadcrumb: [
          {
            text: 'Validators',
            to: { name: 'validators' },
            active: false,
          },
          {
            text: 'Validator',
            to: '/:chain/validators/:address',
            active: true,
          },
        ],
      },
    },
    {
      path: '/error404',
      name: 'error404',
      component: () => import('@/views/error/Error404.vue'),
      meta: {
        layout: 'full',
      },
    },
    // {
    //   path: '/:chain/nft',
    //   name: 'NFT',
    //   component: () => import('@/views/NFT.vue'),
    //   meta: {
    //     pageTitle: 'NFTs',
    //     breadcrumb: [
    //       {
    //         text: 'NFTs',
    //         to: { name: 'NFT' },
    //         active: true,
    //       },
    //     ],
    //   },
    // },
    // {
    //   path: '/:chain/trade',
    //   name: 'trade',
    //   component: () => import('@/views/Trade.vue'),
    //   meta: {
    //     pageTitle: 'Trade',
    //     breadcrumb: [
    //       {
    //         text: 'Trade',
    //         to: { name: 'trade' },
    //         active: true,
    //       },
    //     ],
    //   },
    // },
    {
      path: '/explorers',
      name: 'explorers',
      component: () => import('@/views/links/Explorers.vue'),
      meta: {
        pageTitle: 'Explorers',
        breadcrumb: [
          {
            text: 'Explorers',
            to: { name: 'explorers' },
            active: true,
          },
        ],
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: {
        pageTitle: 'Login',
        breadcrumb: [
          {
            text: 'Login',
            to: { name: 'login' },
            active: true,
          },
        ],
      },
    },
    {
      path: '/:chain/info',
      name: 'info',
      component: () => import('@/views/Info.vue'),
      meta: {
        pageTitle: 'Info',
        breadcrumb: [
          {
            text: 'Info',
            to: { name: 'info' },
            active: true,
          },
        ],
      },
    },
    // {
    //   path: '/:chain/groups',
    //   name: 'groups',
    //   component: () => import('@/views/Groups.vue'),
    //   meta: {
    //     pageTitle: 'Groups',
    //     breadcrumb: [
    //       {
    //         text: 'Groups',
    //         to: { name: 'groups' },
    //         active: true,
    //       },
    //     ],
    //   },
    // },
    {
      path: '/index.php',
      redirect: '/',
    },
    {
      path: '*',
      redirect: '/error404',
    },
  ],
})

router.beforeEach((to, from, next) => {
  const configs = JSON.parse(localStorage.getItem('chains'))
  if (configs && to.params.chain) {
    const c = String(to.params.chain).toLowerCase()
    const conf = Object.values(configs).find(i => i.chain_name === c || i.alias === c)
    if (conf) {
      store.commit('select', { chain_name: conf.chain_name })
      next()
    } else {
      next({ name: 'chain404' })
    }
  } else {
    next()
  }
})

// ? For splash screen
// Remove afterEach hook if you are not using splash screen
router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = 'none'
    // appLoading.style.backgroundColor = 'black'
  }
})

export default router
