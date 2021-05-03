import { Address } from '@graphprotocol/graph-ts'
import { ConvictionVoting as ConvictionVotingContract } from '../../generated/templates/ConvictionVoting/ConvictionVoting'
import { HookedTokenManager as HookedTokenManagerContract } from '../../generated/templates/ConvictionVoting/HookedTokenManager'
import { loadOrCreateConfig, loadOrCreateOrg, loadTokenData } from '.'

export function loadWrappableToken(convictionVotingAddress: Address): void {
  const convictionVotingApp = ConvictionVotingContract.bind(convictionVotingAddress)
  const orgAddress = convictionVotingApp.kernel()
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
