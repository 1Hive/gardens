import { Address } from '@graphprotocol/graph-ts'
import { HookedTokenManager as HookedTokenManagerContract } from '../../generated/templates/ConvictionVoting/HookedTokenManager'
import { loadOrCreateConfig, loadOrCreateOrg, loadTokenData } from '.'

export function loadWrappableToken(orgAddress: Address): void {
  const orgConfig = loadOrCreateConfig(orgAddress)
  const tokensApp = HookedTokenManagerContract.bind(orgConfig.tokens as Address)
  const wrappableTokenAddress = tokensApp.wrappableToken()

  const tokenId = loadTokenData(wrappableTokenAddress)
  if (tokenId) {
    const org = loadOrCreateOrg(orgAddress)
    org.wrappableToken = wrappableTokenAddress.toHexString()
    org.save()
  }
}
