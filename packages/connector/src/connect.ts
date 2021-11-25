import { Organization } from '@1hive/connect-core'
import Garden from './models/Garden'
import GardenConnectorTheGraph, { pollIntervalFromChainId, subgraphUrlFromChainId } from './thegraph/connector'

type Config = {
  pollInterval?: number
  subgraphUrl: string
}

type IOrganization = Organization

/**
 * The default way to connect a Garden and start fetching data from the subgraph.
 * @category Main
 * @param organization Organization class we are connecting to using Aragon Connect.
 * @param config A configuration object.
 * @returns A new Garden instance.
 */
export default function connectGarden(organization: IOrganization, config?: Config): Garden {
  const { network, orgConnector } = organization.connection

  const subgraphUrl = config?.subgraphUrl ?? subgraphUrlFromChainId(network.chainId) ?? undefined

  let pollInterval
  if (orgConnector.name === 'thegraph') {
    pollInterval =
      config?.pollInterval ?? pollIntervalFromChainId(network.chainId) ?? orgConnector.config?.pollInterval ?? undefined
  }

  const GardenConnector = new GardenConnectorTheGraph({
    pollInterval,
    subgraphUrl,
  })

  return new Garden(GardenConnector, organization.address)
}
