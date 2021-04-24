import { ConfigData, ConvictionConfigData, IGardenConnector, VotingConfigData } from '../types'

export default class Config {
  #connector: IGardenConnector

  readonly id: string
  readonly conviction: ConvictionConfigData
  readonly voting: VotingConfigData

  constructor(data: ConfigData, connector: IGardenConnector) {
    this.#connector = connector

    this.id = data.id
    this.conviction = data.conviction
    this.voting = data.voting
  }
}
