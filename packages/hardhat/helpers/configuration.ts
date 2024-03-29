import { eEthereumNetwork, eXDaiNetwork, eLocalHostNetwork } from './types'

export const Config = {
  Bases: {
    [eEthereumNetwork.mumbai]: {
      AragonID: '0xb7E098cB86b120363A935730970A3758861ba458',
      DAOFactory: '0xE97999F411333E3B712104aa04fc06b149BD12eA',
      ENS: '0xB1576a9bE5EC445368740161174f3Dd1034fF8be',
      MiniMeFactory: '0x14E1326445077E2E170eb48785a849e30D502994',
      HoneyswapRouter: '',
      HoneyToken: '',
      StableToken: '',
      HoneyPriceOracle: '',
      PriceOracleFactory: '', // Requires updating hex before deployment
      CollateralRequirementUpdaterFactory: '0x75409fa02734668B1c0E351dbC51e93bBd402A6f',
      UniswapV2Factory: '',
      UnipoolFactory: '0xAD289640D2D6976b6d7dd87eecC33B0cf6332BAF',
      Arbitrator: '0x68E18891159475c21E9f98bbb8b33234769328b1', // Mock Celeste
      StakingFactory: '0x2C3ac82981979af1611F6Efb17a4a3a04d1F9245',
    },
    [eEthereumNetwork.polygon]: {
      AragonID: '0x7b9cd2d5eCFE44C8b64E01B93973491BBDAe879B',
      DAOFactory: '0xEe261Cf86cFf35d8657a4B5D4d1546B4d72c5314',
      ENS: '0x7EdE100965B1E870d726cD480dD41F2af1Ca0130',
      MiniMeFactory: '0xcFed1594A5b1B612dC8199962461ceC148F14E68',
      HoneyswapRouter: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
      HoneyToken: '0xb371248dd0f9e4061ccf8850e9223ca48aa7ca4b',
      StableToken: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
      HoneyPriceOracle: '0x15f627b9c47bbfbbc2194c9a8db2e722e090a690',
      PriceOracleFactory: '0x01D464be5866Dc2bCA4dC30269D08406d2f6dC46', // Requires updating hex before deployment
      CollateralRequirementUpdaterFactory: '0xD608eC04f748c9E1982A6965E422722e9506E061',
      UniswapV2Factory: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
      UnipoolFactory: '0x022eD1710Cd17193C9eD05D516E8Ea64b036a44F',
      Arbitrator: '0xf0C8376065fadfACB706caFbaaC96B321069C015', // Mock Celeste 0x124C3Ae1EfBf30c61966989D150738978D16849A
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
    [eXDaiNetwork.gnosis]: {
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
    [eEthereumNetwork.goerli]: {
      AragonID: '0x7749e4b09ab585d3e9db4c461943e994b809168f',
      DAOFactory: '0x0c514a00401666780fca29d4cd6943085818f049',
      ENS: '0x8cf5a255ed61f403837f040b8d9f052857469273',
      MiniMeFactory: '0x61bce7f119a438eb85b7e78fe980a258adc87291',
      HoneyswapRouter: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d', //UNISWAP_V2_ROUTER_02 https://github.com/1Hive/uniswap-v2-periphery
      HoneyToken: '0x2d467a24095b262787f58ce97d9b130ce7232b57', //HNYT
      StableToken: '0xdc31ee1784292379fbb2964b3b9c4124d8f89c60', //DAI
      HoneyPriceOracle: '0x732cf7ff8a3df9daedc283587be2051dc67ac6c3', // IncentivisedSlidingWindowOracle contract https://github.com/1Hive/uniswap-v2-periphery
      PriceOracleFactory: '0x5c0cecb41148e1528e7ec8d8a6a04cc2b3e0592c', // IncentivisedPriceOracleFactory https://github.com/1Hive/uniswap-v2-periphery
      CollateralRequirementUpdaterFactory: '0x03ba12e20494b9bf1805be207272de459d034b1b', // https://github.com/1Hive/agreement-app
      UniswapV2Factory: '0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f',
      UnipoolFactory: '0x67e278df46fce316aae1c67007d89c65c4257b7b', // https://github.com/1Hive/unipool
      Arbitrator: '0x15ea6e0ab085b8d7d899672f10f213d53ce02150', // MockCeleste
      StakingFactory: '0x76adfd1da857249a82cba01469b42ee9813ad0f3', // https://github.com/1Hive/staking
    },
    //Using gnosis data to use the fork functionality on localhost
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
    //Using gnosis data to use the fork functionality on hardhat
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
