import { Address } from '@graphprotocol/graph-ts'
import { GardensTemplate as GardensTemplateContract } from '../../generated/GardensTemplate/GardensTemplate'
import { HoneyswapFactory as HoneyswapFactoryContract } from '../../generated/GardensTemplate/HoneyswapFactory'
import { HoneyswapRouter as HoneyswapRouterContract } from '../../generated/GardensTemplate/HoneyswapRouter'
import { Pair as PairContract } from '../../generated/GardensTemplate/Pair'
import { Pair as PairTemplate } from '../../generated/templates'
import { tokenHasOrg, loadOrCreateOrg, ZERO_ADDRESS } from '.'
import { Organization as OrganizationEntity, Token as TokenEntity } from '../../generated/schema'

function getOrgTokenFromPair(pairContract: PairContract): TokenEntity | null {
  const token0 = TokenEntity.load(pairContract.token0().toHexString())

  if (tokenHasOrg(token0)) {
    return token0
  } else {
    return TokenEntity.load(pairContract.token1().toHexString())
  }
}

export function populateLiquidityFromContract(pairAddress: Address): void {
  const pair = PairContract.bind(pairAddress)
  const reserves = pair.getReserves()
  /**
   * Note we assume the pair contract has one org token.
   */
  const orgToken = getOrgTokenFromPair(pair) as TokenEntity
  if (orgToken.organization) {
    // FIX Maybe add console.log for debugging when that its null
    const org = OrganizationEntity.load(orgToken.organization!)
    if (org) {
      // FIXMaybe add console.log for debugging when that its null
      if (Address.fromString(orgToken.id).equals(pair.token0())) {
        org.honeyLiquidity = reserves.value1
      } else {
        org.honeyLiquidity = reserves.value0
      }

      org.save()
    }
  }
}

export function setUpHoneyLiquidity(templateAddress: Address, orgAddress: Address): void {
  const gardensTemplate = GardensTemplateContract.bind(templateAddress)
  const honeyswapRouter = HoneyswapRouterContract.bind(gardensTemplate.honeyswapRouter())
  const honeyswapFactory = HoneyswapFactoryContract.bind(honeyswapRouter.factory())
  const org = loadOrCreateOrg(orgAddress)

  const token = org.wrappableToken ? org.wrappableToken : org.token
  if (!token) {
    console.log('setUpHoneyLiquidity->org.token is null')
    return
  }
  // Use BYOT token if it's available
  const orgToken = TokenEntity.load(token!)

  if (!orgToken) {
    console.log('setUpHoneyLiquidity->orgToken TokenEntity is null')
    return
  }
  // We assume org entity has token field set
  const honeyDaoTokenPairAddress = honeyswapFactory.getPair(
    gardensTemplate.honeyToken(),
    Address.fromString(orgToken.id)
  )

  if (honeyDaoTokenPairAddress.equals(ZERO_ADDRESS)) {
    return
  }

  orgToken.organization = org.id
  orgToken.save()

  PairTemplate.create(honeyDaoTokenPairAddress)
  populateLiquidityFromContract(honeyDaoTokenPairAddress)
}
