import { Address } from '@graphprotocol/graph-ts'
import { HookedTokenManager as HookedTokenManagerContract } from '../../generated/templates/Kernel/HookedTokenManager'
import { loadOrCreateConfig, loadOrCreateOrg, loadTokenData } from '.'

export function loadWrappableToken(orgAddress: Address): void {
  const orgConfig = loadOrCreateConfig(orgAddress)
  if (!orgConfig.tokens) {
    return
  }

  const tokensApp = HookedTokenManagerContract.bind(orgConfig.tokens as Address)
  const result = tokensApp.try_wrappableToken()
  if (result.reverted) {
    return
  }

  const wrappableTokenAddress = result.value

  const tokenId = loadTokenData(wrappableTokenAddress)
  if (tokenId) {
    const org = loadOrCreateOrg(orgAddress)
    org.wrappableToken = wrappableTokenAddress.toHexString()
    org.save()
  }
}
