import 'dotenv/config'
import { HardhatUserConfig } from 'hardhat/types'

import '@nomiclabs/hardhat-ethers'
import '@tenderly/hardhat-tenderly'
import '@typechain/hardhat'
import 'hardhat-deploy'

import { node_url, accounts, account } from './helpers/network'

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.4.24',
        settings: {
          optimizer: {
            enabled: true,
            runs: 1, // Increase to 20000 for Arbitrum deployment
          },
        },
      },
    ],
  },
  namedAccounts: {
    deployer: 0,
  },
  networks: {
    hardhat: {
      // process.env.HARDHAT_FORK will specify the network that the fork is made from.
      // this line ensure the use of the corresponding accounts
      accounts: accounts(process.env.HARDHAT_FORK),
      forking: process.env.HARDHAT_FORK
        ? {
            url: node_url(process.env.HARDHAT_FORK),
            blockNumber: process.env.HARDHAT_FORK_NUMBER ? parseInt(process.env.HARDHAT_FORK_NUMBER) : undefined,
          }
        : undefined,
    },
    localhost: {
      url: node_url('localhost'),
      accounts: accounts(),
      timeout: 0,
    },
    mainnet: {
      url: node_url('mainnet'),
      accounts: accounts('mainnet'),
    },
    rinkeby: {
      url: node_url('rinkeby'),
      accounts: account('rinkeby'),
    },
    goerli: {
      url: node_url('goerli'),
      accounts: account('goerli'),
    },
    xdai: {
      url: node_url('xdai'),
      accounts: account('xdai'),
    },
    polygon: {
      url: node_url('polygon'),
      accounts: account('polygon'),
    },
    mumbai: {
      url: node_url('mumbai'),
      accounts: account('mumbai'),
    },
    arbitrum: {
      url: node_url('arbitrum'),
      accounts: accounts('arbitrum'),
      gasPrice: 0,
    },
    arbtest: {
      url: node_url('arbtest'),
      accounts: accounts('arbtest'),
      gasPrice: 0,
    },
    frame: {
      url: 'http://localhost:1248',
      httpHeaders: { origin: 'hardhat' },
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  typechain: {
    outDir: 'typechain',
    target: 'ethers-v5',
  },
  mocha: {
    timeout: 0,
  },
  external: process.env.HARDHAT_FORK
    ? {
        deployments: {
          // process.env.HARDHAT_FORK will specify the network that the fork is made from.
          // these lines allow it to fetch the deployments from the network being forked from both for node and deploy task
          hardhat: ['deployments/' + process.env.HARDHAT_FORK],
          localhost: ['deployments/' + process.env.HARDHAT_FORK],
        },
      }
    : undefined,
}

export default config
