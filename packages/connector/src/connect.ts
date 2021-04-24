import { Organization } from '@aragon/connect-core'
import Garden from './models/Garden'
import GardenConnectorTheGraph, {
  pollIntervalFromChainId,
  subgraphUrlFromChainId,
} from './thegraph/connector'

type Config = {
  pollInterval?: number
  subgraphUrl: string
}

export default function connectGarden(
  organization: Organization,
  config?: Config
) {
  const { network, orgConnector } = organization.connection

  const subgraphUrl =
    config?.subgraphUrl ?? subgraphUrlFromChainId(network.chainId) ?? undefined

  let pollInterval
  if (orgConnector.name === 'thegraph') {
    pollInterval =
      config?.pollInterval ??
      pollIntervalFromChainId(network.chainId) ??
      orgConnector.config?.pollInterval ??
      undefined
  }

  const GardenConnector = new GardenConnectorTheGraph({
    pollInterval,
    subgraphUrl,
  })

  return new Garden(GardenConnector, organization.address)
}
