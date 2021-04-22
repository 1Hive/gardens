import { eEthereumNetwork, eXDaiNetwork, eLocalHostNetwork } from "./types";

export const Config = {
  Bases: {
    [eXDaiNetwork.xdai]: {
      AragonID: "0x0b3b17f9705783bb51ae8272f3245d6414229b36",
      DAOFactory: "0x4037f97fcc94287257e50bd14c7da9cb4df18250",
      ENS: "0xaafca6b0c89521752e559650206d7c925fd0e530",
      MiniMeFactory: "0xf7d36d4d46cda364edc85e5561450183469484c5",
    },
    [eEthereumNetwork.rinkeby]: {
      AragonID: "0x3665e7bFd4D3254AE7796779800f5b603c43C60D",
      DAOFactory: "0xad4d106b43b480faa3ef7f98464ffc27fc1faa96",
      ENS: "0x98Df287B6C145399Aaa709692c8D308357bC085D",
      MiniMeFactory: "0x6ffeb4038f7f077c4d20eaf1706980caec31e2bf",
      HoneyswapRouter: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
      HoneyToken: "0x3050e20fabe19f8576865811c9f28e85b96fa4f9",
      StableToken: "0x531eab8bb6a2359fe52ca5d308d85776549a0af9",
      PriceOracle: "0xa87F58dBBE3A4D01d7F776e02b4dd3237f598095" // Not being called...
    },

    //Using xdai data to use the fork functionality on localhost
    [eLocalHostNetwork.localhost]: {
      AragonID: "0x0b3b17f9705783bb51ae8272f3245d6414229b36",
      DAOFactory: "0x4037f97fcc94287257e50bd14c7da9cb4df18250",
      ENS: "0xaafca6b0c89521752e559650206d7c925fd0e530",
      MiniMeFactory: "0xf7d36d4d46cda364edc85e5561450183469484c5",
    }
  },
};

export default Config;
