import { eEthereumNetwork, eXDaiNetwork, eLocalHostNetwork } from './types'

export const Config = {
  Bases: {
    [eXDaiNetwork.xdai]: {
      AragonID: '0x0b3b17f9705783bb51ae8272f3245d6414229b36',
      DAOFactory: '0x4037f97fcc94287257e50bd14c7da9cb4df18250',
      ENS: '0xaafca6b0c89521752e559650206d7c925fd0e530',
      MiniMeFactory: '0xf7d36d4d46cda364edc85e5561450183469484c5',
      HoneyswapRouter: '0x1C232F01118CB8B424793ae03F870aa7D0ac7f77',
      HoneyToken: '0x71850b7e9ee3f13ab46d67167341e4bdc905eef9',
      StableToken: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d',
      HoneyPriceOracle: '0x6f38D112b13eda1E3abAFC61E296Be2E27F15071',
      PriceOracleFactory: '0x058fAd765f4B33e3Fb9e16B37973EFC00249CbBF',
      CollateralRequirementUpdaterFactory: '0x186F0bF13D2C1D06eBB296aaE0eaB9A5008f776D',
      UniswapV2Factory: '0xA818b4F111Ccac7AA31D0BCc0806d64F2E0737D7',
      UnipoolFactory: '0xD38EB36B7E8b126Ff1E9fDD007bC4050B6C6aB7c',
      Arbitrator: '0x44E4fCFed14E1285c9e0F6eae77D5fDd0F196f85',
      StakingFactory: '0xe71331AEf803BaeC606423B105e4d1C85f012C00'
    },
    [eEthereumNetwork.rinkeby]: {
      AragonID: '0x3665e7bFd4D3254AE7796779800f5b603c43C60D',
      DAOFactory: '0xad4d106b43b480faa3ef7f98464ffc27fc1faa96',
      ENS: '0x98Df287B6C145399Aaa709692c8D308357bC085D',
      MiniMeFactory: '0x6ffeb4038f7f077c4d20eaf1706980caec31e2bf',
      HoneyswapRouter: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
      HoneyToken: '0x3050e20fabe19f8576865811c9f28e85b96fa4f9',
      StableToken: '0x531eab8bb6a2359fe52ca5d308d85776549a0af9',
      HoneyPriceOracle: '0xa87F58dBBE3A4D01d7F776e02b4dd3237f598095',
      PriceOracleFactory: '0xC37B12c6d8ab6336947920e9c2F4f5777F2C3450',
      CollateralRequirementUpdaterFactory: '0x4c4B2EE79D42d21E76045b0d7B2f9DD0e951F4Ed',
      UniswapV2Factory: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
      UnipoolFactory: '0x710D70591C70B1aA96d558269193F0e59F52E154',
      Arbitrator: '0x35e7433141D5f7f2EB7081186f5284dCDD2ccacE',
      StakingFactory: '0xE376a7bbD20Ba75616D6a9d0A8468195a5d695FC'
    },

    //Using xdai data to use the fork functionality on localhost
    [eLocalHostNetwork.localhost]: {
      AragonID: '0x0b3b17f9705783bb51ae8272f3245d6414229b36',
      DAOFactory: '0x4037f97fcc94287257e50bd14c7da9cb4df18250',
      ENS: '0xaafca6b0c89521752e559650206d7c925fd0e530',
      MiniMeFactory: '0xf7d36d4d46cda364edc85e5561450183469484c5',
      HoneyswapRouter: '0x1C232F01118CB8B424793ae03F870aa7D0ac7f77',
      HoneyToken: '0x71850b7e9ee3f13ab46d67167341e4bdc905eef9',
      StableToken: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d',
      HoneyPriceOracle: '0x6f38D112b13eda1E3abAFC61E296Be2E27F15071',
      PriceOracleFactory: '0x058fAd765f4B33e3Fb9e16B37973EFC00249CbBF',
      CollateralRequirementUpdaterFactory: '0x186F0bF13D2C1D06eBB296aaE0eaB9A5008f776D',
      UniswapV2Factory: '0xA818b4F111Ccac7AA31D0BCc0806d64F2E0737D7',
      UnipoolFactory: '0xD38EB36B7E8b126Ff1E9fDD007bC4050B6C6aB7c',
      Arbitrator: '0x44E4fCFed14E1285c9e0F6eae77D5fDd0F196f85',
      StakingFactory: '0xe71331AEf803BaeC606423B105e4d1C85f012C00'
    },
  },
}

export default Config
