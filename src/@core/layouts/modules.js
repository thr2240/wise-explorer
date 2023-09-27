export default () => ([
  {
    scope: 'normal',
    title: 'dashboard',
    route: 'dashboard',
  },
  {
    scope: 'normal',
    title: 'blocks',
    route: 'blocks',
  },
  {
    scope: 'normal',
    title: 'validators',
    route: 'validators',
  },
  {
    scope: 'normal',
    title: 'IBC',
    route: 'ibc',
  },
  // {
  //   scope: 'ollo',
  //   title: 'groups',
  //   route: 'groups',
  // },
  // {
  //   scope: 'ollo',
  //   title: 'trade',
  //   route: 'trade',
  // },
  // {
  //   scope: 'ollo',
  //   title: 'NFTs',
  //   route: 'NFT',
  // },
  // {
  //   scope: 'ollo',
  //   title: 'governance',
  //   route: 'ollogov',
  // },
  {
    scope: 'normal',
    title: 'governance',
    route: 'governance',
    exclude: 'emoney',
  },
  // {
  //   scope: 'normal',
  //   title: 'uptime',
  //   route: 'uptime',
  // },
  {
    scope: 'normal',
    title: 'parameters',
    route: 'parameters',
  },
  {
    scope: 'cos-mos',
    title: 'gravity',
    route: 'gravity',
  },
  {
    scope: 'osmosis',
    title: 'trade',
    route: 'osmosis-trade',
  },
])
