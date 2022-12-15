import { Address, BigInt, DataSourceTemplate } from '@graphprotocol/graph-ts'
import { loadOrCreateOrg, MAX_UINT_256 } from './helpers'
import { onAppTemplateCreated } from './hooks'
import {
  ONE_HIVE_FLUID_PROPOSALS_ADDRESS,
  ONE_HIVE_GARDEN_ADDRESS,
  ONE_HIVE_GARDEN_PRICE_ORACLE_ADDRESS,
  TEST_GARDEN,
  TEST_FLUID_PROPOSALS_ADDRESS,
  AGREEMENT_APPIDS,
  CONVICTION_VOTING_APPIDS,
  TOKENS_APPIDS,
  VOTING_APPIDS,
} from './constants'
import { FluidProposals } from '../generated/templates'

export function processApp(orgAddress: Address, appAddress: Address, appId: string): void {
  let template: string

  if (VOTING_APPIDS.includes(appId)) {
    template = 'DisputableVoting'
  } else if (CONVICTION_VOTING_APPIDS.includes(appId)) {
    template = 'ConvictionVoting'
  } else if (AGREEMENT_APPIDS.includes(appId)) {
    template = 'Agreement'
  } else if (TOKENS_APPIDS.includes(appId)) {
    template = 'HookedTokenManager'
  }

  if (template) {
    DataSourceTemplate.create(template, [appAddress.toHexString()])
    onAppTemplateCreated(orgAddress, appAddress, appId)
  }
}

export function processOrg(orgAddress: Address, timestamp: BigInt): void {
  const org = loadOrCreateOrg(orgAddress)
  if (org.createdAt.isZero()) {
    org.createdAt = timestamp

    if (ONE_HIVE_GARDEN_ADDRESS.equals(orgAddress)) {
      org.honeyLiquidity = MAX_UINT_256
      org.incentivisedPriceOracle = ONE_HIVE_GARDEN_PRICE_ORACLE_ADDRESS
      org.fluidProposals = ONE_HIVE_FLUID_PROPOSALS_ADDRESS

      FluidProposals.create(ONE_HIVE_FLUID_PROPOSALS_ADDRESS)
    }
  }

  if (TEST_GARDEN.equals(orgAddress)) {
    org.fluidProposals = TEST_FLUID_PROPOSALS_ADDRESS

    FluidProposals.create(TEST_FLUID_PROPOSALS_ADDRESS)
  }

  org.save()
}
