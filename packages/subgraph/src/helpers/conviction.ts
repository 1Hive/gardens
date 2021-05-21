import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts'
import {
  ConvictionConfig as ConvictionConfigEntity,
  Proposal as ProposalEntity,
  Stake as StakeEntity,
  StakeHistory as StakeHistoryEntity,
} from '../../generated/schema'
import {
  ConvictionVoting as ConvictionVotingContract,
  ProposalAdded as ProposalAddedEvent,
} from '../../generated/templates/ConvictionVoting/ConvictionVoting'
import { loadOrCreateConfig, loadOrCreateOrg, loadTokenData } from '.'
import { loadWrappableToken } from './tokens'

/// /// Conviction config entity //////
function getConvictionConfigEntityId(appAddress: Address): string {
  return appAddress.toHexString()
}

export function getConvictionConfigEntity(appAddress: Address): ConvictionConfigEntity | null {
  const configEntityId = getConvictionConfigEntityId(appAddress)

  let config = ConvictionConfigEntity.load(configEntityId)

  if (!config) {
    config = new ConvictionConfigEntity(configEntityId)
  }

  return config
}

export function loadConvictionConfig(orgAddress: Address, appAddress: Address): void {
  // General org config
  const config = loadOrCreateConfig(orgAddress)

  // Conviction voting config
  const convictionConfig = getConvictionConfigEntity(appAddress)
  const convictionVoting = ConvictionVotingContract.bind(appAddress)
  // Load tokens data
  const stakeToken = convictionVoting.stakeToken()
  const stableToken = convictionVoting.stableToken()
  const stakeTokenId = loadTokenData(stakeToken)
  if (stakeTokenId) {
    convictionConfig.stakeToken = stakeToken.toHexString()

    // Set token for org
    const org = loadOrCreateOrg(orgAddress)
    org.token = stakeToken.toHexString()
    org.save()
  }
  const stableTokenId = loadTokenData(stableToken)
  if (stableTokenId) {
    convictionConfig.stableToken = stableToken.toHexString()
  }

  const requestToken = convictionVoting.requestToken()
  // App could be instantiated without a vault
  const requestTokenId = loadTokenData(requestToken)
  if (requestTokenId) {
    convictionConfig.requestToken = requestToken.toHexString()
  }

  // Load wrappable token data
  // Note we handle the wrappable token here to make sure the
  // initialize event was already called for the tokens app
  loadWrappableToken(orgAddress)

  // Load conviction params
  convictionConfig.decay = convictionVoting.decay()
  convictionConfig.weight = convictionVoting.weight()
  convictionConfig.maxRatio = convictionVoting.maxRatio()
  convictionConfig.pctBase = convictionVoting.D()
  convictionConfig.totalStaked = convictionVoting.totalStaked()
  convictionConfig.maxStakedProposals = convictionVoting.MAX_STAKED_PROPOSALS().toI32()
  convictionConfig.minThresholdStakePercentage = convictionVoting.minThresholdStakePercentage()
  convictionConfig.contractPaused = false
  convictionConfig.stableTokenOracle = convictionVoting.stableTokenOracle()

  convictionConfig.save()

  config.conviction = convictionConfig.id
  config.save()
}

/// /// Stake entity //////
export function getStakeEntityId(proposalId: string, supporterId: string): string {
  return proposalId + '-supporter:' + supporterId
}

export function getStakeEntity(proposal: ProposalEntity | null, supporterId: string): StakeEntity | null {
  const stakeId = getStakeEntityId(proposal.id, supporterId)

  let stake = StakeEntity.load(stakeId)
  if (!stake) {
    stake = new StakeEntity(stakeId)
    stake.supporter = supporterId
    stake.proposal = proposal.id
  }

  return stake
}

/// /// Stake History entity //////
export function getStakeHistoryEntityId(proposalId: string, supporterId: string, timestamp: BigInt): string {
  return proposalId + '-supporter:' + supporterId + '-time:' + timestamp.toString()
}

export function getStakeHistoryEntity(
  proposal: ProposalEntity | null,
  supporterId: string,
  blockNumber: BigInt
): StakeHistoryEntity | null {
  const stakeHistoryId = getStakeHistoryEntityId(proposal.id, supporterId, blockNumber)

  const stakeHistory = new StakeHistoryEntity(stakeHistoryId)
  stakeHistory.proposal = proposal.id
  stakeHistory.supporter = supporterId
  stakeHistory.time = blockNumber

  return stakeHistory
}

export function getOrgAddress(appAddress: Address): Address {
  const convictionVoting = ConvictionVotingContract.bind(appAddress)
  return convictionVoting.kernel()
}

/// /// Proposal entity //////
export function populateProposalDataFromEvent(proposal: ProposalEntity | null, event: ProposalAddedEvent): void {
  proposal.metadata = event.params.title
  proposal.link = event.params.link.toString()
  proposal.requestedAmount = event.params.amount
  proposal.creator = event.params.entity
  proposal.createdAt = event.block.timestamp
  proposal.beneficiary = event.params.beneficiary
  proposal.actionId = event.params.actionId
  proposal.stable = event.params.stable
}
