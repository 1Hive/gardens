import { Contract } from '@ethersproject/contracts'
import { ethers } from 'hardhat'
import { Kernel } from '../typechain'

export const getEventArgFromReceipt = (receipt, event, arg) => {
  return receipt.events.filter((receiptEvent) => receiptEvent.event == event)[0].args[arg]
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

/**
 * Get proxies from a deployed DAO
 * @param daoAddress Address of the DAO
 * @param appIds List of appIds
 * @returns Returns an object of the form { [appId]: proxy | proxy[] }
 */
export const getApps = async (daoAddress: string, appIds: string[]): Promise<string[]> => {
  const dao = (await ethers.getContractAt('Kernel', daoAddress)) as Kernel
  const apps = await dao.queryFilter(dao.filters.NewAppProxy(null, null, null)).then((events) =>
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
