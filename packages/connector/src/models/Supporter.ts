import {
  CastData,
  IGardenConnector,
  OrganizationData,
  StakeData,
  StakeHistoryData,
  SupporterData,
  UserData,
} from '../types'

export default class Supporter implements SupporterData {
  #connector: IGardenConnector

  readonly id: string
  readonly user: UserData
  readonly organization: OrganizationData
  readonly representative: string
  readonly casts: CastData[]
  readonly stakes: StakeData[]
  readonly stakesHistory: StakeHistoryData[]

  constructor(data: SupporterData, connector: IGardenConnector) {
    this.#connector = connector

    this.id = data.id
    this.user = data.user
    this.organization = data.organization
    this.representative = data.representative
    this.casts = data.casts
    this.stakes = data.stakes
    this.stakesHistory = data.stakesHistory
  }
}
