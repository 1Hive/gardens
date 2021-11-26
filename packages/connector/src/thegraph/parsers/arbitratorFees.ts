import { QueryResult } from '@1hive/connect-thegraph'
import ArbitratorFee from '../../models/ArbitratorFee'
import { IGardenConnector } from 'src/types'

export function parseArbitratorFee(result: QueryResult, connector: IGardenConnector): ArbitratorFee | null {
  const arbitratorFee = result.data.arbitratorFee

  if (!arbitratorFee) {
    return null
  }

  return new ArbitratorFee(
    {
      id: arbitratorFee.id,
      proposalId: arbitratorFee.proposal.id,
      tokenId: arbitratorFee.token.id,
      tokenDecimals: arbitratorFee.token.decimals,
      tokenSymbol: arbitratorFee.token.symbol,
      amount: arbitratorFee.amount,
    },
    connector
  )
}
