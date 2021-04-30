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

  constructor(connector: IGardenConnector, address: Address) {
    this.#connector = connector
    this.#address = address
  }

  async disconnect() {
    await this.#connector.disconnect()
  }

  config(): Promise<Config> {
    return this.#connector.config(this.#address)
  }

  onConfig(callback: FunctionCallback): SubscriptionHandler {
    return this.#connector.onConfig(this.#address, callback)
  }

  async proposal({ number = '', appAddress = '' } = {}): Promise<Proposal> {
    const proposalId = buildProposalId(parseInt(number), appAddress)
    return this.#connector.proposal(proposalId)
  }

  onProposal({ number = '', appAddress = '' } = {}, callback: FunctionCallback): SubscriptionHandler {
    const proposalId = buildProposalId(parseInt(number), appAddress)
    return this.#connector.onProposal(proposalId, callback)
  }

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

  async supporter({ id = '' } = {}): Promise<Supporter> {
    const supporterId = buildSupporterId(id, this.#address)
    return this.#connector.supporter(supporterId)
  }

  onSupporter({ id = '' } = {}, callback: FunctionCallback): SubscriptionHandler {
    const supporterId = buildSupporterId(id, this.#address)
    return this.#connector.onSupporter(supporterId, callback)
  }
}
