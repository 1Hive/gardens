import { QueryResult } from '@1hive/connect-thegraph'
import { IGardenConnector } from 'src/types'
import CollateralRequirement from '../../models/CollateralRequirement'

export function parseCollateralRequirement(
  result: QueryResult,
  connector: IGardenConnector
): CollateralRequirement | null {
  const proposal = result.data.proposal

  if (!proposal) {
    throw new Error('Unable to parse collateral requirement.')
  }

  const { collateralRequirement } = proposal
  if (!collateralRequirement) {
    return null
  }

  return new CollateralRequirement(
    {
      id: collateralRequirement.id,
      proposalId: collateralRequirement.proposal.id,
      tokenId: collateralRequirement.token.id,
      tokenDecimals: collateralRequirement.token.decimals,
      tokenSymbol: collateralRequirement.token.symbol,
      actionAmount: collateralRequirement.actionAmount,
      challengeAmount: collateralRequirement.challengeAmount,
      challengeDuration: collateralRequirement.challengeDuration,
    },
    connector
  )
}
