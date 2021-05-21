import 'dotenv/config'
import { HardhatUserConfig } from 'hardhat/config'
import { node_url, accounts } from './helpers/network'

import '@nomiclabs/hardhat-waffle'
import '@tenderly/hardhat-tenderly'
import '@nomiclabs/hardhat-etherscan'
import '@typechain/hardhat'
import 'hardhat-deploy'
import 'hardhat-gas-reporter'
import 'solidity-coverage'

const config: HardhatUserConfig = {
  solidity: {
    version: '0.4.24',
    settings: {
      optimizer: {
        enabled: true,
        runs: 5000,
      },
    },
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
      accounts: accounts('rinkeby'),
    },
    xdai: {
      url: node_url('xdai'),
      accounts: accounts('xdai'),
      gasPrice: 1000000000,
    },
  },
  gasReporter: {
    currency: 'USD',
    gasPrice: 100,
    enabled: process.env.REPORT_GAS ? true : false,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    maxMethodDiff: 10,
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
  tenderly: {
    project: process.env.TENDERLY_PROJECT || '',
    username: process.env.TENDERLY_USERNAME || '',
  },
}

export default config
