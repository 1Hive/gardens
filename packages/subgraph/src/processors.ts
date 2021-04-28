import { Address, BigInt, DataSourceTemplate } from '@graphprotocol/graph-ts'
import { loadOrCreateOrg } from './helpers'
import { onAppTemplateCreated } from './hooks'
import { AGREEMENT_APPIDS, CONVICTION_VOTING_APPIDS, VOTING_APPIDS } from './appIds'

export function processApp(orgAddress: Address, appAddress: Address, appId: string): void {
  let template: string

  if (VOTING_APPIDS.includes(appId)) {
    template = 'DisputableVoting'
  } else if (CONVICTION_VOTING_APPIDS.includes(appId)) {
    template = 'ConvictionVoting'
  } else if (AGREEMENT_APPIDS.includes(appId)) {
    template = 'Agreement'
  }

  if (template) {
    DataSourceTemplate.create(template, [appAddress.toHexString()])
    onAppTemplateCreated(orgAddress, appAddress, appId)
  }
}

export function processOrg(orgAddress: Address, timestamp: BigInt): void {
  loadOrCreateOrg(orgAddress, timestamp)
}
