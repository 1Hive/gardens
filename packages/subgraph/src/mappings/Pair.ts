import { Sync as SyncEvent } from '../../generated/templates/Pair/Pair'
import { populateLiquidityFromContract } from '../helpers'

export function handleSync(event: SyncEvent): void {
  populateLiquidityFromContract(event.address)
}
