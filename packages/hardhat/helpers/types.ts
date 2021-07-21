export type eNetwork = eEthereumNetwork | eXDaiNetwork

export enum eEthereumNetwork {
  rinkeby = 'rinkeby',
  main = 'main',
  coverage = 'coverage',
  hardhat = 'hardhat',
  arbtest = 'arbtest',
  arbitrum = 'arbitrum'
}

export enum eXDaiNetwork {
  xdai = 'xdai',
}

export enum EthereumNetworkNames {
  rinkeby = 'rinkeby',
  main = 'main',
  xdai = 'xdai',
  arbtest = 'arbtest',
  arbitrum = 'arbitrum'
}

export enum eLocalHostNetwork {
  localhost = 'localhost',
}
