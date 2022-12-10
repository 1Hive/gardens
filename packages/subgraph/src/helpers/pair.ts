import { Address, log } from '@graphprotocol/graph-ts'
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
    const org = OrganizationEntity.load(orgToken.organization!)
    if (org) {
      if (Address.fromString(orgToken.id).equals(pair.token0())) {
        org.honeyLiquidity = reserves.value1
      } else {
        org.honeyLiquidity = reserves.value0
      }

      org.save()
    } else {
      log.error('populateLiquidityFromContract::org its not defined', [])
    }
  } else {
    log.error('populateLiquidityFromContract::orgToken.organization its not defined', [])
  }
}

export function setUpHoneyLiquidity(templateAddress: Address, orgAddress: Address): void {
  const gardensTemplate = GardensTemplateContract.bind(templateAddress)
  const honeyswapRouter = HoneyswapRouterContract.bind(gardensTemplate.honeyswapRouter())
  const honeyswapFactory = HoneyswapFactoryContract.bind(honeyswapRouter.factory())
  const org = loadOrCreateOrg(orgAddress)
  // Use BYOT token if it's available
  const useBYOT = org.wrappableToken ? true : false

  if (useBYOT || (!useBYOT && org.token)) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const orgToken = TokenEntity.load(useBYOT ? org.wrappableToken! : org.token!)
    if (orgToken) {
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
    } else {
      log.error('orgToken its not defined', [])
    }
  } else {
    log.error('useBYOT || (!useBYOT && org.token)', [])
  }
}
