import hre, { ethers } from 'hardhat'
import { BigNumber } from 'ethers'
import { Contract } from '@ethersproject/contracts'
import { Signer } from '@ethersproject/abstract-signer'

import { GardensTemplate, ERC20, Kernel, IUnipoolFactory } from '../typechain'

const { deployments } = hre

/**
 * Get proxies from a deployed DAO
 * @param daoAddress Address of the DAO
 * @param appIds List of appIds
 * @returns Returns an object of the form { [appId]: proxy | proxy[] }
 */
export const getApps = async (daoAddress: string, appIds: string[]): Promise<string[]> => {
  const dao = (await ethers.getContractAt('Kernel', daoAddress)) as Kernel
  const currentBlockNumber = await ethers.provider.getBlockNumber()
  const apps = await dao
    .queryFilter(dao.filters.NewAppProxy(null, null, null), currentBlockNumber - 100, 'latest')
    .then((events) =>
      events
        .filter(({ args }) => appIds.includes(args.appId))
        .map(({ args }) => ({
          appId: args.appId,
          proxy: args.proxy,
        }))
        .reduce(
          (apps, { appId, proxy }) => ({
            ...apps,
            [appId]: !apps[appId] ? proxy : [...apps[appId], proxy],
          }),
          {}
        )
    )
  return appIds.map((appId) => apps[appId])
}

export const getGardensTemplate = async (signer: Signer): Promise<GardensTemplate> => {
  const gardensTemplateAddress = (await deployments.get('GardensTemplate')).address
  return (await ethers.getContractAt('GardensTemplate', gardensTemplateAddress, signer)) as GardensTemplate
}

export const getUnipoolFactory = async (signer: Signer, gardensTemplate: GardensTemplate): Promise<IUnipoolFactory> => {
  const unipoolFactoryAddress = await gardensTemplate.unipoolFactory()
  return (await ethers.getContractAt('IUnipoolFactory', unipoolFactoryAddress, signer)) as IUnipoolFactory
}

export const getHoneyToken = async (signer: Signer, gardensTemplate: GardensTemplate) => {
  const honeyTokenAddress = await gardensTemplate.honeyToken()
  return (await ethers.getContractAt('ERC20', honeyTokenAddress, signer)) as ERC20
}

export const getOriginalToken = async (signer: Signer, address: string) => {
  return (await ethers.getContractAt('ERC20', address, signer)) as ERC20
}

export const getEventArgument = async (
  selectedFilter: string,
  arg: number | string,
  contract: Contract,
  transactionHash: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const filter = contract.filters[selectedFilter]()

    contract.on(filter, (...args) => {
      const event = args.pop()
      if (event.transactionHash === transactionHash) {
        contract.removeAllListeners(filter)
        resolve(event.args[arg])
      }
    })
  })
}

export const getEventArgFromReceipt = (receipt, event, arg) => {
  return receipt.events.filter((receiptEvent) => receiptEvent.event == event)[0].args[arg]
}

export const toTokens = (amount, decimals = 18) => {
  const [integer, decimal] = String(amount).split('.')
  return BigNumber.from((integer != '0' ? integer : '') + (decimal || '').padEnd(decimals, '0'))
}
