import { Address } from '@graphprotocol/graph-ts'
import { CONVICTION_VOTING_APPIDS } from './appIds'
import { loadConvictionConfig } from './helpers'

export function onAppTemplateCreated(orgAddress: Address, appAddress: Address, appId: string): void {
  if (CONVICTION_VOTING_APPIDS.includes(appId)) {
    loadConvictionConfig(orgAddress, appAddress)
  }
}
