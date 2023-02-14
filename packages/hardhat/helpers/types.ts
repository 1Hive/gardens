export type eNetwork = eEthereumNetwork | eXDaiNetwork

export enum eEthereumNetwork {
  goerli = 'goerli',
  rinkeby = 'rinkeby',
  main = 'main',
  coverage = 'coverage',
  hardhat = 'hardhat',
  arbtest = 'arbtest',
  arbitrum = 'arbitrum',
  mumbai = 'mumbai',
  polygon = 'polygon',
}

export enum eXDaiNetwork {
  gnosis = 'gnosis',
}

export enum EthereumNetworkNames {
  goerli = 'goerli',
  rinkeby = 'rinkeby',
  main = 'main',
  gnosis = 'gnosis',
  arbtest = 'arbtest',
  arbitrum = 'arbitrum',
  mumbai = 'mumbai',
  polygon = 'polygon',
}

export enum eLocalHostNetwork {
  localhost = 'localhost',
  hardhat = 'hardhat',
}
