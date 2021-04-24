import { GraphQLWrapper } from '@aragon/connect-thegraph'
import { subgraphUrlFromChainId } from './thegraph/connector'
import { ORGANIZATIONS } from './thegraph/queries'

type Config = {
  network: number
  subgraphUrl?: string
}

export async function getGardens(config: Config, { first = 1000 }) {
  const subgraphUrl = config?.subgraphUrl ?? subgraphUrlFromChainId(config.network) ?? undefined

  if (!subgraphUrl) {
    throw new Error('subgraphUrl required to be passed.')
  }

  const client = new GraphQLWrapper(subgraphUrl)
  const result = await client.performQuery(ORGANIZATIONS, { first })

  if (!result.data.organizations) {
    throw new Error('Unable to find gardens.')
  }

  return result.data.organizations
}
