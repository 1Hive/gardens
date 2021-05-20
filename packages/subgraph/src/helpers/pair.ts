import { Address, log } from '@graphprotocol/graph-ts'
import { GardensTemplate as GardensTemplateContract } from '../../generated/GardensTemplate/GardensTemplate'
import { HoneyswapFactory as HoneyswapFactoryContract } from '../../generated/GardensTemplate/HoneyswapFactory'
import { HoneyswapRouter as HoneyswapRouterContract } from '../../generated/GardensTemplate/HoneyswapRouter'
import { Pair as PairContract } from '../../generated/GardensTemplate/Pair'
import { Pair as PairTemplate } from '../../generated/templates'
import { isOrgToken, loadOrCreateOrg, ZERO_ADDRESS } from '.'
import { Organization as OrganizationEntity, Token as TokenEntity } from '../../generated/schema'

function getOrgTokenFromPair(pairContract: PairContract): TokenEntity | null {
  const token0 = TokenEntity.load(pairContract.token0().toHexString())

  if (isOrgToken(token0)) {
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
  const org = OrganizationEntity.load(orgToken.organization)

  if (Address.fromString(orgToken.id).equals(pair.token0())) {
    org.honeyLiquidity = reserves.value1
  } else {
    org.honeyLiquidity = reserves.value0
  }

  org.save()
}

export function setUpHoneyLiquidity(templateAddress: Address, orgAddress: Address): void {
  const org = loadOrCreateOrg(orgAddress)
  const gardensTemplate = GardensTemplateContract.bind(templateAddress)
  const honeyswapRouter = HoneyswapRouterContract.bind(gardensTemplate.honeyswapRouter())
  const honeyswapFactory = HoneyswapFactoryContract.bind(honeyswapRouter.factory())
  // Note we assume org entity has token field set
  const honeyDaoTokenPairAddress = honeyswapFactory.getPair(gardensTemplate.honeyToken(), Address.fromString(org.token))

  if (honeyDaoTokenPairAddress.equals(ZERO_ADDRESS)) {
    return
  }

  PairTemplate.create(honeyDaoTokenPairAddress)
  populateLiquidityFromContract(honeyDaoTokenPairAddress)
}
