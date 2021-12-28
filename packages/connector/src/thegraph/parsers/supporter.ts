import { QueryResult } from '@1hive/connect-thegraph'
import Supporter from '../../models/Supporter'
import { CastData, IGardenConnector, StakeData, StakeHistoryData, SupporterData } from '../../types'

export function parseSupporter(result: QueryResult, connector: IGardenConnector): SupporterData | null {
  const supporter = result.data.supporter

  if (!supporter) {
    return null
  }

  // For votes (decisions)
  const casts = supporter.casts.map((cast: CastData) => cast)

  // For proposals (suggestions and proposals)
  const stakes = supporter.stakes.map((stake: StakeData) => stake)
  const stakesHistory = supporter.stakesHistory.map((stake: StakeHistoryData) => stake)

  return new Supporter(
    {
      ...supporter,
      casts,
      stakes,
      stakesHistory,
    },
    connector
  )
}
