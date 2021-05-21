import { Address } from '@graphprotocol/graph-ts'

import {
  HookedTokenManager as HookedTokenManagerContract,
  TokenManagerInitialized as TokenManagerInitializedEvent,
} from '../../generated/templates/HookedTokenManager/HookedTokenManager'
import { loadOrCreateOrg, loadTokenData } from '../helpers'

const ZERO_ADDRESS = Address.fromHexString('0x0000000000000000000000000000000000000000')

export function handleTokenManagerInitialized(event: TokenManagerInitializedEvent): void {
  const tokenManagerApp = HookedTokenManagerContract.bind(event.address)
  const orgAddress = tokenManagerApp.kernel()

  const org = loadOrCreateOrg(orgAddress)

  const tokenAddress = event.params.token
  const wrappableTokenAddress = event.params.wrappableToken

  loadTokenData(tokenAddress)
  org.token = tokenAddress.toHexString()

  if (wrappableTokenAddress.notEqual(ZERO_ADDRESS)) {
    loadTokenData(wrappableTokenAddress)
    org.wrappableToken = wrappableTokenAddress.toHexString()
  }

  org.save()
}
