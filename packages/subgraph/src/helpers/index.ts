import { Address, BigInt } from '@graphprotocol/graph-ts'
import { ERC20 as ERC20Contract } from '../../generated/templates/ConvictionVoting/ERC20'
import {
  Config as ConfigEntity,
  Organization as OrganizationEntity,
  Proposal as ProposalEntity,
  Supporter as SupporterEntity,
  Token as TokenEntity,
  User as UserEntity,
} from '../../generated/schema'
import { STATUS_ACTIVE, STATUS_ACTIVE_NUM } from '../statuses'

export const ZERO_ADDRESS = Address.fromString('0x0000000000000000000000000000000000000000')

/// /// Token Entity //////
export function tokenHasOrg(token: TokenEntity | null): boolean {
  return !!token && !!token.organization
}

export function saveOrgToken(tokenId: string, orgAddress: Address): void {
  const org = loadOrCreateOrg(orgAddress)
  if (!org.token) {
    org.token = tokenId
    org.save()
  }
}

/// /// Token Entity //////
export function loadTokenData(address: Address): string {
  const id = address.toHexString()
  const token = TokenEntity.load(id)

  if (!token) {
    const token = new TokenEntity(id)
    const tokenContract = ERC20Contract.bind(address)

    // App could be instantiated without a vault which means request token could be invalid
    const symbol = tokenContract.try_symbol()
    if (symbol.reverted) {
      return null
    }

    token.symbol = symbol.value
    token.name = tokenContract.name()
    token.decimals = tokenContract.decimals()
    token.save()
  }

  return id
}

/// /// General Config Entity //////
export function loadOrCreateConfig(orgAddress: Address): ConfigEntity {
  const id = orgAddress.toHexString()
  let config = ConfigEntity.load(id)

  if (config === null) {
    config = new ConfigEntity(id)
  }

  return config!
}

/// /// Organization entity //////
export function loadOrCreateOrg(orgAddress: Address): OrganizationEntity {
  const id = orgAddress.toHexString()
  let organization = OrganizationEntity.load(id)

  if (organization === null) {
    const config = loadOrCreateConfig(orgAddress)
    organization = new OrganizationEntity(id)
    organization.config = config.id
    organization.proposalCount = 0
    organization.active = true
    organization.createdAt = BigInt.fromI32(0)
    organization.supporterCount = 0
    organization.honeyLiquidity = BigInt.fromI32(0)

    config.save()
  }

  return organization!
}

export function loadOrCreateUser(address: Address): UserEntity {
  const userId = address.toHexString()
  let user = UserEntity.load(userId)

  if (user === null) {
    user = new UserEntity(userId)
    user.address = address
    user.save()
  }

  return user!
}

/// /// Organization Support Entity //////
export function loadOrCreateSupporter(address: Address, orgAddress: Address): SupporterEntity {
  const user = loadOrCreateUser(address)

  const id = getSupporterEntityId(address, orgAddress)
  let supporter = SupporterEntity.load(id)

  if (supporter === null) {
    supporter = new SupporterEntity(id)
    supporter.user = user.id
    supporter.organization = orgAddress.toHexString()
    incrementSupporterCount(orgAddress)
  }
  return supporter!
}

export function getSupporterEntityId(address: Address, orgAddress: Address): string {
  return address.toHexString() + '-org:' + orgAddress.toHexString()
}

/// /// Proposal Entity //////
export function getProposalEntityId(appAddress: Address, proposalId: BigInt): string {
  return 'appAddress:' + appAddress.toHexString() + '-proposalId:' + proposalId.toHexString()
}

export function getProposalEntity(appAddress: Address, proposalId: BigInt): ProposalEntity {
  const proposalEntityId = getProposalEntityId(appAddress, proposalId)

  let proposal = ProposalEntity.load(proposalEntityId)
  if (!proposal) {
    proposal = new ProposalEntity(proposalEntityId)
    proposal.number = proposalId
    proposal.status = STATUS_ACTIVE
    proposal.statusInt = STATUS_ACTIVE_NUM
    proposal.weight = BigInt.fromI32(0)
    proposal.challengeId = BigInt.fromI32(0)
    proposal.challenger = Address.fromString('0x0000000000000000000000000000000000000000')
    proposal.challengeEndDate = BigInt.fromI32(0)
    proposal.snapshotBlock = BigInt.fromI32(0) // needed because of required value on Voting data
    proposal.settledAt = BigInt.fromI32(0)
    proposal.disputedAt = BigInt.fromI32(0)
    proposal.executedAt = BigInt.fromI32(0)
    proposal.pausedAt = BigInt.fromI32(0)
    proposal.pauseDuration = BigInt.fromI32(0)
  }

  return proposal!
}

export function incrementProposalCount(orgAddress: Address): void {
  const org = loadOrCreateOrg(orgAddress)
  org.proposalCount += 1
  org.save()
}

export function incrementSupporterCount(orgAddress: Address): void {
  const org = loadOrCreateOrg(orgAddress)
  org.supporterCount += 1
  org.save()
}

// Export local helpers
export * from './conviction'
export * from './voting'
export * from './agreement'
export * from './pair'
