import { eEthereumNetwork, eXDaiNetwork, eLocalHostNetwork } from './types'

export const Config = {
  Bases: {
    [eEthereumNetwork.mumbai]: {
      AragonID: '0xb7E098cB86b120363A935730970A3758861ba458',
      DAOFactory: '0xE97999F411333E3B712104aa04fc06b149BD12eA',
      ENS: '0xB1576a9bE5EC445368740161174f3Dd1034fF8be',
      MiniMeFactory: '0x14E1326445077E2E170eb48785a849e30D502994',
      HoneyswapRouter: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506', // Sushiswap Mumbai deployment
      HoneyToken: '0x7570C560cCAB8455A6726ad54978E6d1ce6fda7c', // Unused, just for reference (cv request token)
      StableToken: '0xF9c0EBA79d452d3F426F12117DE5a10676a812d3', // Using HoneyV2 as contract
      HoneyPriceOracle: '', // Unused
      PriceOracleFactory: '0x992AA39502D76E594B80B4102F5FeA692fE0d537', // Sushiswap Mumbai deployment
      CollateralRequirementUpdaterFactory: '0xd1a3dD30bc63dC90bE2fC0c3Ec7Fe188E48FF402',
      UniswapV2Factory: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4', // Sushiswap Mumbai deployment
      UnipoolFactory: '0xAD289640D2D6976b6d7dd87eecC33B0cf6332BAF',
      Arbitrator: '0x68E18891159475c21E9f98bbb8b33234769328b1', // Mock Celeste
      StakingFactory: '0x2C3ac82981979af1611F6Efb17a4a3a04d1F9245',
      Erc721AdapterFactory: '0x1Ba0465165736b1fbc3c0ce984b4dD062Ae346C6',
    },
    [eEthereumNetwork.polygon]: {
      AragonID: '',
      DAOFactory: '',
      ENS: '',
      MiniMeFactory: '0xcFed1594A5b1B612dC8199962461ceC148F14E68',
      HoneyswapRouter: '',
      HoneyToken: '',
      StableToken: '',
      HoneyPriceOracle: '',
      PriceOracleFactory: '', // Requires updating hex before deployment
      CollateralRequirementUpdaterFactory: '0xD608eC04f748c9E1982A6965E422722e9506E061',
      UniswapV2Factory: '',
      UnipoolFactory: '0x022eD1710Cd17193C9eD05D516E8Ea64b036a44F',
      Arbitrator: '0x124C3Ae1EfBf30c61966989D150738978D16849A', // Mock Celeste
      StakingFactory: '0xe4FDEff6633E5d4408C94E6736795b8cd6EEB4Ac',
    },
    [eEthereumNetwork.arbitrum]: {
      AragonID: '0xf2E58AdD12dc1d73725574CfD33068Ca8d978f91',
      DAOFactory: '0x959Bc393f42C803D04C4ACCe7157553dbd4cBD35',
      ENS: '0x2DDE068a7fdF72c10848298cC0317E691E40E593',
      MiniMeFactory: '',
      HoneyswapRouter: '',
      HoneyToken: '',
      StableToken: '',
      HoneyPriceOracle: '',
      PriceOracleFactory: '', // Requires updating hex before deployment
      CollateralRequirementUpdaterFactory: '0x14E1326445077E2E170eb48785a849e30D502994',
      UniswapV2Factory: '',
      UnipoolFactory: '0x62F3b99Ef24f5070b9ae80552e321ec89aBFC71B',
      Arbitrator: '',
      StakingFactory: '0x425f7E1024cb86De06970FE6eF8423Cf6424e5c1',
    },
    [eEthereumNetwork.arbtest]: {
      AragonID: '0xdCFeD4A30D696b8200aF9C4Cae88f201b9511041',
      DAOFactory: '0x3476A931490BD5ae7e497AB6B58Dd2DF3946d5A9',
      ENS: '0x73ddD4B38982aB515daCf43289B41706f9A39199',
      MiniMeFactory: '0x4790d9A35c653481df31B914d2022A5CcF016c15',
      HoneyswapRouter: '0x0Fe2d157c5f1334eDd687d045143CE4b36f88040',
      HoneyToken: '0x230D3B7D94d838086c88B1D195Bd41BC5DBfE1A5',
      StableToken: '0x205F76D6dDD95D7bA53b131506EA851B04568899',
      HoneyPriceOracle: '0x0Cb61941f07aEB908A5991fE8a74a4B13a9404Ae',
      PriceOracleFactory: '0xe4FDEff6633E5d4408C94E6736795b8cd6EEB4Ac',
      CollateralRequirementUpdaterFactory: '0xf674e14c3c1488F7d259907438f15d38A143dEF1',
      UniswapV2Factory: '0xC7120Cb97283B5527a24fD5b9971c6deB362f08E',
      UnipoolFactory: '0xd1a3dD30bc63dC90bE2fC0c3Ec7Fe188E48FF402',
      Arbitrator: '0x41A67fc74983353A4a443A9D80500F7655A40DfA',
      StakingFactory: '0x2038976E96cDe0187820Bd84e6b36D595e979bD9',
    },
    [eXDaiNetwork.xdai]: {
      AragonID: '0x0b3b17f9705783bb51ae8272f3245d6414229b36',
      DAOFactory: '0x4037f97fcc94287257e50bd14c7da9cb4df18250',
      ENS: '0xaafca6b0c89521752e559650206d7c925fd0e530',
      MiniMeFactory: '0x3e436327F27131405860EC9478B4e26071D9A83a',
      HoneyswapRouter: '0x1C232F01118CB8B424793ae03F870aa7D0ac7f77',
      HoneyToken: '0x71850b7e9ee3f13ab46d67167341e4bdc905eef9',
      StableToken: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d',
      HoneyPriceOracle: '0x6f38D112b13eda1E3abAFC61E296Be2E27F15071',
      PriceOracleFactory: '0x058fAd765f4B33e3Fb9e16B37973EFC00249CbBF',
      CollateralRequirementUpdaterFactory: '0x186F0bF13D2C1D06eBB296aaE0eaB9A5008f776D',
      UniswapV2Factory: '0xA818b4F111Ccac7AA31D0BCc0806d64F2E0737D7',
      UnipoolFactory: '0xD38EB36B7E8b126Ff1E9fDD007bC4050B6C6aB7c',
      Arbitrator: '0x44E4fCFed14E1285c9e0F6eae77D5fDd0F196f85',
      StakingFactory: '0xe71331AEf803BaeC606423B105e4d1C85f012C00',
    },
    [eEthereumNetwork.rinkeby]: {
      AragonID: '0x3665e7bFd4D3254AE7796779800f5b603c43C60D',
      DAOFactory: '0xad4d106b43b480faa3ef7f98464ffc27fc1faa96',
      ENS: '0x98Df287B6C145399Aaa709692c8D308357bC085D',
      MiniMeFactory: '0x556dB7a212E0fb1B9C77958bE0744Af7768bf503',
      HoneyswapRouter: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
      HoneyToken: '0x3050e20fabe19f8576865811c9f28e85b96fa4f9',
      StableToken: '0x531eab8bb6a2359fe52ca5d308d85776549a0af9',
      HoneyPriceOracle: '0xa87F58dBBE3A4D01d7F776e02b4dd3237f598095',
      PriceOracleFactory: '0xC37B12c6d8ab6336947920e9c2F4f5777F2C3450',
      CollateralRequirementUpdaterFactory: '0x4c4B2EE79D42d21E76045b0d7B2f9DD0e951F4Ed',
      UniswapV2Factory: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
      UnipoolFactory: '0x710D70591C70B1aA96d558269193F0e59F52E154',
      Arbitrator: '0x35e7433141D5f7f2EB7081186f5284dCDD2ccacE',
      StakingFactory: '0xE376a7bbD20Ba75616D6a9d0A8468195a5d695FC',
    },
    //Using xdai data to use the fork functionality on localhost
    [eLocalHostNetwork.localhost]: {
      AragonID: '0x0b3b17f9705783bb51ae8272f3245d6414229b36',
      DAOFactory: '0x4037f97fcc94287257e50bd14c7da9cb4df18250',
      ENS: '0xaafca6b0c89521752e559650206d7c925fd0e530',
      MiniMeFactory: '0x3e436327F27131405860EC9478B4e26071D9A83a',
      HoneyswapRouter: '0x1C232F01118CB8B424793ae03F870aa7D0ac7f77',
      HoneyToken: '0x71850b7e9ee3f13ab46d67167341e4bdc905eef9',
      StableToken: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d',
      HoneyPriceOracle: '0x6f38D112b13eda1E3abAFC61E296Be2E27F15071',
      PriceOracleFactory: '0x058fAd765f4B33e3Fb9e16B37973EFC00249CbBF',
      CollateralRequirementUpdaterFactory: '0x186F0bF13D2C1D06eBB296aaE0eaB9A5008f776D',
      UniswapV2Factory: '0xA818b4F111Ccac7AA31D0BCc0806d64F2E0737D7',
      UnipoolFactory: '0xD38EB36B7E8b126Ff1E9fDD007bC4050B6C6aB7c',
      Arbitrator: '0x44E4fCFed14E1285c9e0F6eae77D5fDd0F196f85',
      StakingFactory: '0xe71331AEf803BaeC606423B105e4d1C85f012C00',
    },
    //Using xdai data to use the fork functionality on hardhat
    [eLocalHostNetwork.hardhat]: {
      AragonID: '0x0b3b17f9705783bb51ae8272f3245d6414229b36',
      DAOFactory: '0x4037f97fcc94287257e50bd14c7da9cb4df18250',
      ENS: '0xaafca6b0c89521752e559650206d7c925fd0e530',
      MiniMeFactory: '0x3e436327F27131405860EC9478B4e26071D9A83a',
      HoneyswapRouter: '0x1C232F01118CB8B424793ae03F870aa7D0ac7f77',
      HoneyToken: '0x71850b7e9ee3f13ab46d67167341e4bdc905eef9',
      StableToken: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d',
      HoneyPriceOracle: '0x6f38D112b13eda1E3abAFC61E296Be2E27F15071',
      PriceOracleFactory: '0x058fAd765f4B33e3Fb9e16B37973EFC00249CbBF',
      CollateralRequirementUpdaterFactory: '0x186F0bF13D2C1D06eBB296aaE0eaB9A5008f776D',
      UniswapV2Factory: '0xA818b4F111Ccac7AA31D0BCc0806d64F2E0737D7',
      UnipoolFactory: '0xD38EB36B7E8b126Ff1E9fDD007bC4050B6C6aB7c',
      Arbitrator: '0x44E4fCFed14E1285c9e0F6eae77D5fDd0F196f85',
      StakingFactory: '0xe71331AEf803BaeC606423B105e4d1C85f012C00',
    },
  },
}

export default Config
