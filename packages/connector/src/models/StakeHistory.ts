import { IGardenConnector, ProposalData, StakeHistoryData, SupporterData } from '../types'

export default class StakeHistory {
  #connector: IGardenConnector

  readonly id: string
  readonly supporter: SupporterData
  readonly proposal: ProposalData
  readonly tokensStaked: string
  readonly totalTokensStaked: string
  readonly time: string
  readonly conviction: string

  constructor(data: StakeHistoryData, connector: IGardenConnector) {
    this.#connector = connector

    this.id = data.id
    this.supporter = data.supporter
    this.proposal = data.proposal
    this.tokensStaked = data.tokensStaked
    this.totalTokensStaked = data.totalTokensStaked
    this.time = data.time
    this.conviction = data.conviction
  }
}
