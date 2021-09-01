import 'dotenv/config'
import { HardhatUserConfig } from 'hardhat/types'

import '@nomiclabs/hardhat-ethers'
import '@tenderly/hardhat-tenderly'
import '@typechain/hardhat'
import 'hardhat-deploy'
import 'hardhat-gas-reporter'
import 'solidity-coverage'

import { node_url, accounts, account } from './helpers/network'

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.4.24',
        settings: {
          optimizer: {
            enabled: true,
            runs: 5000, // Increase to 20000 for Arbitrum deployment
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
    },
    mainnet: {
      url: node_url('mainnet'),
      accounts: accounts('mainnet'),
    },
    rinkeby: {
      url: node_url('rinkeby'),
      accounts: account('rinkeby'),
      gasPrice: 1000000000,
    },
    xdai: {
      url: node_url('xdai'),
      accounts: account('xdai'),
      gasPrice: 1000000000,
    },
    polygon: {
      url: node_url('polygon'),
      accounts: accounts('polygon'),
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
  gasReporter: {
    currency: 'USD',
    gasPrice: 100,
    enabled: process.env.REPORT_GAS ? true : false,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    maxMethodDiff: 10,
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
