import { GraphQLWrapper, QueryResult } from '@1hive/connect-thegraph'

import { FunctionCallback, IGardenConnector, SubscriptionHandler } from '../types'
import ArbitratorFee from '../models/ArbitratorFee'
import CollateralRequirement from '../models/CollateralRequirement'
import Config from '../models/Config'
import Proposal from '../models/Proposal'
import Supporter from '../models/Supporter'
import * as queries from './queries'
import {
  parseArbitratorFee,
  parseCollateralRequirement,
  parseConfig,
  parseProposal,
  parseProposals,
  parseSupporter,
} from './parsers'

type GardenConnectorConfig = {
  pollInterval?: number
  subgraphUrl?: string
  verbose?: boolean
}

const BLOCK_TIMES = new Map([
  [1, 13], // mainnet
  [4, 14], // rinkeby
  [100, 5], // xdai
])

export function subgraphUrlFromChainId(chainId: number): string | null {
  if (chainId === 1) {
    return 'https://api.thegraph.com/subgraphs/name/1hive/gardens-mainnet'
  }
  if (chainId === 4) {
    return 'https://api.thegraph.com/subgraphs/name/1hive/gardens-rinkeby'
  }
  if (chainId === 100) {
    return 'https://api.thegraph.com/subgraphs/name/1hive/gardens-xdai'
  }
  return null
}

export function pollIntervalFromChainId(chainId: number): number | null {
  const blockTime = BLOCK_TIMES.get(chainId)
  return blockTime ? blockTime * 1000 : null
}

/**
 * Connector that expose functionalities to fetch garden data from subgraphs.
 * @category Utility
 */
export default class GardenConnector implements IGardenConnector {
  #gql: GraphQLWrapper

  /**
   * Create a new GardenConnector instance.z
   * @param config The connector configuration object.
   */
  constructor(config: GardenConnectorConfig) {
    if (!config.subgraphUrl) {
      throw new Error('Garden connector requires subgraphUrl to be passed.')
    }
    this.#gql = new GraphQLWrapper(config.subgraphUrl, {
      pollInterval: config.pollInterval,
      verbose: config.verbose,
    })
  }

  /**
   * Close the connection.
   */
  async disconnect(): Promise<void> {
    this.#gql.close()
  }

  /**
   * Fetch the configuration of the garden.
   * @param address The address of the garden to fetch.
   * @returns A promise that resolves to the configuratio of the garden.
   */
  async config(address: string): Promise<Config> {
    return this.#gql.performQueryWithParser(queries.CONFIG('query'), { address }, (result: QueryResult) =>
      parseConfig(result, this)
    )
  }

  /**
   * Subscribe to updates in the configuration of the garden.
   * @param address The address of the garden to subscribe.
   * @param callback A function callback to postprocess the result.
   * @returns A GraphQL subsription to the configuratio of the garden.
   */
  onConfig(address: string, callback: FunctionCallback): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser(
      queries.CONFIG('subscription'),
      { address },
      callback,
      (result: QueryResult) => parseConfig(result, this)
    )
  }

  /**
   * Fetch a proposal of the garden.
   * @param id The identifier of the proposal to fetch.
   * @returns A promise that resolves to a proposal of the garden.
   */
  async proposal(id: string): Promise<Proposal> {
    return this.#gql.performQueryWithParser(queries.PROPOSAL('query'), { id }, (result: QueryResult) =>
      parseProposal(result, this)
    )
  }

  /**
   * Subscribe to updates in a proposal of the garden.
   * @param id The identifier of the proposal to subscribe.
   * @param callback A function callback to postprocess the result.
   * @returns A GraphQL subsription to a proposal of the garden.
   */
  onProposal(id: string, callback: FunctionCallback): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser(
      queries.PROPOSAL('subscription'),
      { id },
      callback,
      (result: QueryResult) => parseProposal(result, this)
    )
  }

  /**
   * Fetch a list of proposals of the garden.
   * @param garden The address of the garden to fetch.
   * @param first Number of entities to return.
   * @param skip Number of entities to skip.
   * @param orderBy Filter to order the results.
   * @param orderDirection Direction to order the results.
   * @param types Filter by proposal type.
   * @param statuses Filter by proposal status.
   * @param metadata Filter by proposal name.
   * @returns A promise that resolves to a list of proposals of the garden.
   */
  async proposals(
    garden: string,
    first: number,
    skip: number,
    orderBy: string,
    orderDirection: string,
    types: number[],
    statuses: number[],
    metadata: string
  ): Promise<Proposal[]> {
    return this.#gql.performQueryWithParser(
      queries.ALL_PROPOSALS('query'),
      {
        garden,
        first,
        skip,
        orderBy,
        orderDirection,
        proposalTypes: types,
        statuses,
        metadata,
      },
      (result: QueryResult) => parseProposals(result, this)
    )
  }

  /**
   * Subscribe to updates of a list of proposals of the garden.
   * @param garden The address of the garden to subscribe.
   * @param first Number of entities to return.
   * @param skip Number of entities to skip.
   * @param orderBy Filter to order the results.
   * @param orderDirection Direction to order the results.
   * @param types Filter by proposal types.
   * @param statuses Filter by proposal statuses.
   * @param metadata Filter by proposal name.
   * @returns A GraphQL subsription to a list of proposals of the garden.
   */
  onProposals(
    garden: string,
    first: number,
    skip: number,
    orderBy: string,
    orderDirection: string,
    types: number[],
    statuses: number[],
    metadata: string,
    callback: FunctionCallback
  ): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser(
      queries.ALL_PROPOSALS('subscription'),
      {
        garden,
        first,
        skip,
        orderBy,
        orderDirection,
        proposalTypes: types,
        statuses,
        metadata,
      },
      callback,
      (result: QueryResult) => parseProposals(result, this)
    )
  }

  /**
   * Fetch a supporter of the garden.
   * @param id The identifier of the supporter to fetch.
   * @returns A promise that resolves to a supporter of the garden.
   */
  async supporter(id: string): Promise<Supporter> {
    return this.#gql.performQueryWithParser(queries.SUPPORTER('query'), { id }, (result: QueryResult) =>
      parseSupporter(result, this)
    )
  }

  /**
   * Subscribe to updates in a supporter of the garden.
   * @param id The identifier of the supporter to fetch.
   * @param callback A function callback to postprocess the result.
   * @returns A GraphQL subsription to a supporter of the garden.
   */
  onSupporter(id: string, callback: FunctionCallback): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser(
      queries.SUPPORTER('subscription'),
      { id },
      callback,
      (result: QueryResult) => parseSupporter(result, this)
    )
  }

  /**
   * Fetch the collateral requirement of a proposal of the garden.
   * @param proposalId The identifier of the proposal.
   * @returns A promise that resolves to the collateral requirement of a proposal.
   */
  async collateralRequirement(proposalId: string): Promise<CollateralRequirement> {
    return this.#gql.performQueryWithParser<CollateralRequirement>(
      queries.COLLATERAL_REQUIREMENT('query'),
      { proposalId },
      (result: QueryResult) => parseCollateralRequirement(result, this)
    )
  }

  /**
   * Subscribe to updates in the collateral requirement of a proposal of the garden.
   * @param proposalId The identifier of the proposal.
   * @param callback A function callback to postprocess the result.
   * @returns A GraphQL subsription to the collateral requirement of a proposal.
   */
  onCollateralRequirement(proposalId: string, callback: FunctionCallback): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser<CollateralRequirement>(
      queries.COLLATERAL_REQUIREMENT('subscription'),
      { proposalId },
      callback,
      (result: QueryResult) => parseCollateralRequirement(result, this)
    )
  }

  /**
   * Fetch the arbitrator fee of a proposal of the garden.
   * @param arbitratorFeeId The identifier of the arbitrator fee.
   * @returns A promise that resolves to the arbitrator fee of a proposal.
   */
  async arbitratorFee(arbitratorFeeId: string): Promise<ArbitratorFee | null> {
    return this.#gql.performQueryWithParser<ArbitratorFee | null>(
      queries.ARBITRATOR_FEE('query'),
      { arbitratorFeeId },
      (result: QueryResult) => parseArbitratorFee(result, this)
    )
  }

  /**
   * Subscribe to updates in the arbitrator fee of a proposal of the garden.
   * @param arbitratorFeeId The identifier of the arbitrator fee.
   * @param callback A function callback to postprocess the result.
   * @returns A GraphQL subsription to the arbitrator fee of a proposal.
   */
  onArbitratorFee(arbitratorFeeId: string, callback: FunctionCallback): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser<ArbitratorFee | null>(
      queries.ARBITRATOR_FEE('subscription'),
      { arbitratorFeeId },
      callback,
      (result: QueryResult) => parseArbitratorFee(result, this)
    )
  }
}
