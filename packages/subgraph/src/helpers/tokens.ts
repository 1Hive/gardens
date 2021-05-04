import { Address } from '@graphprotocol/graph-ts'
import { HookedTokenManager as HookedTokenManagerContract } from '../../generated/templates/Kernel/HookedTokenManager'
import { loadOrCreateConfig, loadOrCreateOrg, loadTokenData } from '.'

const ZERO_ADDRESS = Address.fromHexString('0x0000000000000000000000000000000000000000')

export function loadWrappableToken(orgAddress: Address): void {
  const orgConfig = loadOrCreateConfig(orgAddress)
  if (!orgConfig.tokens) {
    return
  }

  const tokensApp = HookedTokenManagerContract.bind(orgConfig.tokens as Address)
  const wrappableTokenAddress = tokensApp.wrappableToken()

  if (wrappableTokenAddress.equals(ZERO_ADDRESS)) {
    return
  }

  const tokenId = loadTokenData(wrappableTokenAddress)
  if (tokenId) {
    const org = loadOrCreateOrg(orgAddress)
    org.wrappableToken = wrappableTokenAddress.toHexString()
    org.save()
  }
}
