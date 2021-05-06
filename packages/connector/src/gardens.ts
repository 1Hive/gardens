import { GraphQLWrapper } from '@aragon/connect-thegraph'
import { subgraphUrlFromChainId } from './thegraph/connector'
import { ORGANIZATIONS, USER } from './thegraph/queries'

type Config = {
  network: number
  subgraphUrl?: string
}

type GardenParams = {
  first: number
}

type UserParams = {
  id: string
}

export async function getGardens(config: Config, { first = 1000 }: GardenParams): Promise<any> {
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

export async function getUser(config: Config, { id }: UserParams): Promise<any>  {
  const subgraphUrl = config?.subgraphUrl ?? subgraphUrlFromChainId(config.network) ?? undefined

  if (!subgraphUrl) {
    throw new Error('subgraphUrl required to be passed.')
  }

  const client = new GraphQLWrapper(subgraphUrl)
  const result = await client.performQuery(USER, { id })

  if (!result.data.user) {
    throw new Error('Unable to find user.')
  }

  return result.data.user
}
