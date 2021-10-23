import Config from './Config'
import Proposal from './Proposal'
import Supporter from './Supporter'
import {
  Address,
  ALL_PROPOSAL_STATUSES,
  ALL_PROPOSAL_TYPES,
  FunctionCallback,
  IGardenConnector,
  SubscriptionHandler,
} from '../types'
import { buildProposalId, buildSupporterId } from '../helpers'

export default class Garden {
  #address: Address
  #connector: IGardenConnector

  /**
   * Create a new Garden instance.
   * @param connector A GardenConnector instance.
   * @param address The garden address.
   */
  constructor(connector: IGardenConnector, address: Address) {
    this.#connector = connector
    this.#address = address
  }

  /**
   * Close the connection.
   */
  async disconnect(): Promise<void> {
    await this.#connector.disconnect()
  }

  /**
   * Fetch the configuration of the garden.
   * @returns A promise that resolves to the configuratio of the garden.
   */
  config(): Promise<Config> {
    return this.#connector.config(this.#address)
  }

  /**
   * Subscribe to updates in the configuration of the garden.
   * @param callback A function callback to postprocess the result.
   * @returns A GraphQL subsription to the configuratio of the garden.
   */
  onConfig(callback: FunctionCallback): SubscriptionHandler {
    return this.#connector.onConfig(this.#address, callback)
  }

  /**
   * Fetch a proposal of the garden.
   * @param params
   * @param params.number The proposal identification number.
   * @param params.appAddress The address of the Aragon application that have created the proposals.
   * @returns A promise that resolves to a proposal of the garden.
   */
  async proposal({ number = '', appAddress = '' } = {}): Promise<Proposal> {
    const proposalId = buildProposalId(parseInt(number), appAddress)
    return this.#connector.proposal(proposalId)
  }

  /**
   * Subscribe to updates in a proposal of the garden.
   * @param params
   * @param params.number The proposal identification number.
   * @param params.appAddress The address of the Aragon application that have created the proposals.
   * @param callback A function callback to postprocess the result.
   * @returns A GraphQL subsription to a proposal of the garden.
   */
  onProposal({ number = '', appAddress = '' } = {}, callback: FunctionCallback): SubscriptionHandler {
    const proposalId = buildProposalId(parseInt(number), appAddress)
    return this.#connector.onProposal(proposalId, callback)
  }

  /**
   * Fetch a list of proposals of the garden.
   * @param params A filters object.
   * @param params.first Number of entities to return.
   * @param params.skip Number of entities to skip.
   * @param params.orderBy Filter to order the results.
   * @param params.orderDirection Direction to order the results.
   * @param params.types Filter by proposal type.
   * @param params.statuses Filter by proposal status.
   * @param params.metadata Filter by proposal name.
   * @returns A promise that resolves to a list of proposals of the garden.
   */
  async proposals({
    first = 1000,
    skip = 0,
    orderBy = 'createdAt',
    orderDirection = 'desc',
    types = ALL_PROPOSAL_TYPES,
    statuses = ALL_PROPOSAL_STATUSES,
    metadata = '',
  } = {}): Promise<Proposal[]> {
    return this.#connector.proposals(this.#address, first, skip, orderBy, orderDirection, types, statuses, metadata)
  }

  /**
   * Subscribe to updates of a list of proposals of the garden.
   * @param params A filters object.
   * @param params.first Number of entities to return.
   * @param params.skip Number of entities to skip.
   * @param params.orderBy Filter to order the results.
   * @param params.orderDirection Direction to order the results.
   * @param params.types Filter by proposal type.
   * @param params.statuses Filter by proposal status.
   * @param params.metadata Filter by proposal name.
   * @returns A GraphQL subsription to a list of proposals of the garden.
   */
  onProposals(
    {
      first = 1000,
      skip = 0,
      orderBy = 'createdAt',
      orderDirection = 'desc',
      types = ALL_PROPOSAL_TYPES,
      statuses = ALL_PROPOSAL_STATUSES,
      metadata = '',
    } = {},
    callback: FunctionCallback
  ): SubscriptionHandler {
    return this.#connector.onProposals(
      this.#address,
      first,
      skip,
      orderBy,
      orderDirection,
      types,
      statuses,
      metadata,
      callback
    )
  }

  /**
   * Fetch a supporter of the garden.
   * @param params
   * @param params.id The identifier of the supporter to fetch.
   * @returns A promise that resolves to a supporter of the garden.
   */
  async supporter({ id = '' } = {}): Promise<Supporter> {
    const supporterId = buildSupporterId(id, this.#address)
    return this.#connector.supporter(supporterId)
  }

  /**
   * Subscribe to updates in a supporter of the garden.
   * @param params
   * @param params.id The identifier of the supporter to fetch.
   * @param callback A function callback to postprocess the result.
   * @returns A GraphQL subsription to a supporter of the garden.
   */
  onSupporter({ id = '' } = {}, callback: FunctionCallback): SubscriptionHandler {
    const supporterId = buildSupporterId(id, this.#address)
    return this.#connector.onSupporter(supporterId, callback)
  }
}
