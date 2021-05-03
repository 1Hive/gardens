import { Address, BigInt, DataSourceTemplate } from '@graphprotocol/graph-ts'
import { HookedTokenManager as HookedTokenManagerContract } from '../generated/Kernel/HookedTokenManager'
import { loadOrCreateOrg, loadTokenData } from './helpers'
import { onAppTemplateCreated } from './hooks'
import { AGREEMENT_APPIDS, CONVICTION_VOTING_APPIDS, TOKENS_APPIDS, VOTING_APPIDS } from './appIds'

export function processApp(orgAddress: Address, appAddress: Address, appId: string): void {
  let template: string

  if (VOTING_APPIDS.includes(appId)) {
    template = 'DisputableVoting'
  } else if (CONVICTION_VOTING_APPIDS.includes(appId)) {
    template = 'ConvictionVoting'
  } else if (AGREEMENT_APPIDS.includes(appId)) {
    template = 'Agreement'
  } else if (TOKENS_APPIDS.includes(appId)) {
    const tokensApp = HookedTokenManagerContract.bind(appAddress)
    const wrappableTokenAddress = tokensApp.wrappableToken()
    const tokenId = loadTokenData(wrappableTokenAddress)
    if (tokenId) {
      const org = loadOrCreateOrg(orgAddress)
      org.wrappableToken = wrappableTokenAddress.toHexString()
      org.save()
    }
  }

  if (template) {
    DataSourceTemplate.create(template, [appAddress.toHexString()])
    onAppTemplateCreated(orgAddress, appAddress, appId)
  }
}

export function processOrg(orgAddress: Address, timestamp: BigInt): void {
  const org = loadOrCreateOrg(orgAddress)
  org.createdAt = timestamp
  org.active = true
  org.save()
}
