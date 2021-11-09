import { GraphQLWrapper } from '@aragon/connect-thegraph'
import { subgraphUrlFromChainId } from './thegraph/connector'
import { ORGANIZATION, ORGANIZATIONS, USER } from './thegraph/queries'
import { Organization, User } from './thegraph/queries/types'

type Config = {
  network: number
  subgraphUrl?: string
}

type GardenParams = {
  first?: number
  skip?: number
  orderBy?: string
  orderDirection?: string
}

type UserParams = {
  id: string
}

function getSubgraphClient(config: Config): GraphQLWrapper {
  const subgraphUrl = config?.subgraphUrl ?? subgraphUrlFromChainId(config.network) ?? undefined

  if (!subgraphUrl) {
    throw new Error('subgraphUrl required to be passed.')
  }

  return new GraphQLWrapper(subgraphUrl)
}

/**
 * Fetch a list of gardens from a subgraph.
 * @category Main
 * @param config A configuration object.
 * @param params A filters object.
 * @param params.first Number of entities to return.
 * @param params.skip Number of entities to skip.
 * @param params.orderBy Type of filter to order the results.
 * @param params.orderDirection Direction to order the results.
 * @returns A promise that resolves to a group of gardens.
 */
export async function getGardens(
  config: Config,
  { first = 1000, skip = 0, orderBy = 'createdAt', orderDirection = 'desc' }: GardenParams
): Promise<Organization[]> {
  const client = getSubgraphClient(config)
  const result = await client.performQuery(ORGANIZATIONS, { first, skip, orderBy, orderDirection })

  if (!result.data.organizations) {
    throw new Error('Unable to find gardens.')
  }

  return result.data.organizations
}

/**
 * Fetch a garden from a subgraph.
 * @category Main
 * @param config A configuration object.
 * @param id The garden's id
 * @returns A promise that resolvles to a garden.
 */
export async function getGarden(config: Config, id: string): Promise<Organization> {
  const client = getSubgraphClient(config)
  const result = await client.performQuery(ORGANIZATION, { id })

  if (!result.data.organization) {
    throw new Error(' Unable to find garden.')
  }

  return result.data.organization
}

/**
 * The default way to connect a garden and start fetching data from the subgraph.
 * @category Main
 * @param config A configuration object.
 * @param params A filters object.
 * @param params.id The identifier of a user.
 * @returns A promise that resolves to a group of users.
 */
export async function getUser(config: Config, { id }: UserParams): Promise<User[]> {
  const client = getSubgraphClient(config)
  const result = await client.performQuery(USER, { id })

  if (!result.data.user) {
    throw new Error('Unable to find user.')
  }

  return result.data.user
}
