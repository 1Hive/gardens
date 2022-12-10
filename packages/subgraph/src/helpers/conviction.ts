import { Address, BigInt } from '@graphprotocol/graph-ts'
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
import { loadOrCreateConfig, loadTokenData, saveOrgToken } from '.'

import { log } from '@graphprotocol/graph-ts'

/// /// Conviction config entity //////
function getConvictionConfigEntityId(appAddress: Address): string {
  return appAddress.toHexString()
}

export function getConvictionConfigEntity(appAddress: Address): ConvictionConfigEntity {
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
  const stakeTokenId = loadTokenData(stakeToken)
  convictionConfig.stakeToken = stakeTokenId

  if (stakeTokenId) {
    // Save organization token if not exists (1Hive edge case)
    saveOrgToken(stakeTokenId, orgAddress)
  } else {
    log.error('loadConvictionConfig::stakeTokenId its not defined', [])
  }

  const stableToken = convictionVoting.stableToken()
  const stableTokenId = loadTokenData(stableToken)
  convictionConfig.stableToken = stableTokenId

  const requestToken = convictionVoting.requestToken()
  // App could be instantiated without a vault
  const requestTokenId = loadTokenData(requestToken)
  convictionConfig.requestToken = requestTokenId

  // Load conviction params
  convictionConfig.decay = convictionVoting.decay()
  convictionConfig.weight = convictionVoting.weight()
  convictionConfig.maxRatio = convictionVoting.maxRatio()
  convictionConfig.pctBase = convictionVoting.D()
  convictionConfig.totalStaked = convictionVoting.totalStaked()
  convictionConfig.maxStakedProposals = convictionVoting.MAX_STAKED_PROPOSALS().toI32()
  convictionConfig.minThresholdStakePercentage = convictionVoting.minThresholdStakePercentage()
  convictionConfig.contractPaused = false

  // Get funds owner
  let fundsManager: Address | null = null
  const vault = convictionVoting.try_vault()
  if (!vault.reverted) {
    fundsManager = vault.value
  } else {
    const fundsManagerResult = convictionVoting.try_fundsManager()
    if (!fundsManagerResult.reverted) {
      fundsManager = fundsManagerResult.value
    }
  }

  convictionConfig.fundsManager = fundsManager
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
  if (!proposal) {
    return null
  }
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
  if (!proposal) {
    return null
  }
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
  if (proposal) {
    proposal.metadata = event.params.title
    proposal.link = event.params.link.toString()
    proposal.requestedAmount = event.params.amount
    proposal.creator = event.params.entity
    proposal.createdAt = event.block.timestamp
    proposal.beneficiary = event.params.beneficiary
    proposal.actionId = event.params.actionId
    proposal.stable = event.params.stable
    proposal.txHash = event.transaction.hash.toHexString()
  }
}
