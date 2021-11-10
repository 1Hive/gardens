import gql from 'graphql-tag'
import { DocumentNode } from 'graphql'

export const ORGANIZATIONS = gql`
  query Organizations($first: Int!, $skip: Int!, $orderBy: String!, $orderDirection: String!) {
    organizations(
      first: $first
      where: { active: true }
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      id
      active
      createdAt
      proposalCount
      token {
        id
        symbol
        name
        decimals
      }
      wrappableToken {
        id
        symbol
        name
        decimals
      }
      honeyLiquidity
      supporterCount
      incentivisedPriceOracle
      unipool
    }
  }
`

export const ORGANIZATION = gql`
  query Organization($id: String!) {
    organization(id: $id) {
      id
      active
      createdAt
      proposalCount
      token {
        id
        symbol
        name
        decimals
      }
      wrappableToken {
        id
        symbol
        name
        decimals
      }
      honeyLiquidity
      supporterCount
      incentivisedPriceOracle
      unipool
    }
  }
`

// TODO: Filters
export const CONFIG = (type: string): DocumentNode => gql`
  ${type} Config($address: ID!) {
    config(id: $address) {
      id

      # conviction voting config
      conviction {
        id
        decay
        weight
        maxRatio
        pctBase
        stakeToken {
          id
          name
          symbol
          decimals
        }
        totalStaked
        maxStakedProposals
        minThresholdStakePercentage
        fundsManager
        requestToken {
          id
          name
          symbol
          decimals
        }
        stableToken {
          id
          name
          symbol
          decimals
        }
        stableTokenOracle
        contractPaused
      }

      # voting config
      voting {
        id
        settingId
        token {
          id
          name
          symbol
          decimals
        }
        voteTime
        supportRequiredPct
        minimumAcceptanceQuorumPct
        delegatedVotingPeriod
        quietEndingPeriod
        quietEndingExtension
        executionDelay
        createdAt
      }
    }
  }
`

export const ALL_PROPOSALS = (type: string): DocumentNode => gql`
  ${type} Proposals($garden: String!, $first: Int!, $skip: Int!, $proposalTypes: [Int]!, $statuses: [Int]!, $metadata: String! $orderBy: String!, $orderDirection: String!) {
    proposals(where: { organization: $garden, typeInt_in: $proposalTypes, statusInt_in: $statuses, metadata_contains: $metadata },  first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection) {
      id
      organization {
        id
      }
      number
      creator
      status
      type
      createdAt
      metadata
      executedAt

      # Proposal / Suggestion data (signaling proposals and proposals requesting funds)
      link
      stakes(where: { amount_gt: 0 }, first: 1000, orderBy: createdAt, orderDirection: asc) {
        id
        type
        supporter {
          user {
            id
            address
          }
        }
        amount
        createdAt
      }
      stakesHistory(first: 1000, orderBy: createdAt, orderDirection: asc) {
        id
        type
        supporter {
          user {
            id
            address
          }
        }
        tokensStaked
        totalTokensStaked
        conviction
        time      # Block at which was created
        createdAt # Timestamp at which was created
      }
      beneficiary
      requestedAmount
      totalTokensStaked
      stable
     
     # Decision data (votes)
      setting { 
        id
        token {
          id
        }
        settingId
        voteTime
        supportRequiredPct
        minimumAcceptanceQuorumPct
        delegatedVotingPeriod
        quietEndingPeriod
        quietEndingExtension
        executionDelay
        createdAt
      }
      startDate
      totalPower
      snapshotBlock
      yeas
      nays
      quietEndingExtensionDuration
      quietEndingSnapshotSupport
      script
      isAccepted
      castVotes {
        id
        supporter {
          id
          user {
            address
          }
        }
        caster
        supports
        stake
        createdAt
      }

      # Disputable data
      actionId
      challengeId
      challenger
      challengeEndDate
      disputeId
      settledAt
      settlementOffer
      disputedAt
      pausedAt
      pauseDuration
      submitterArbitratorFee {
        id
      }
      challengerArbitratorFee {
        id
      }

      collateralRequirement {
        token {
          id
          symbol
          decimals
        }
        actionAmount
        challengeAmount
        challengeDuration
      }
    }
  }
`

export const PROPOSAL = (type: string): DocumentNode => gql`
  ${type} Proposal($id: ID!) {
    proposal(id: $id) {
      id
      organization {
        id
      }
      number
      creator
      status
      type
      createdAt
      metadata
      executedAt

      # Proposal / Suggestion data (signaling proposals and proposals requesting funds)
      link
      stakes(where: { amount_gt: 0 }, first: 1000, orderBy: createdAt, orderDirection: asc) {
        id
        type
        supporter {
          user {
            id
            address
          }
          organization {
            id
          }
        }
        amount
        createdAt
      }
      stakesHistory(first: 1000, orderBy: createdAt, orderDirection: asc) {
        id
        type
        supporter {
          user {
            id
            address
          }
          organization {
            id
          }
        }
        tokensStaked
        totalTokensStaked
        conviction
        time      # Block at which was created
        createdAt # Timestamp at which was created
      }
      beneficiary
      requestedAmount
      totalTokensStaked
      stable
     
      # Decision data (votes)
      setting { 
        id
        token {
          id
        }
        settingId
        voteTime
        supportRequiredPct
        minimumAcceptanceQuorumPct
        delegatedVotingPeriod
        quietEndingPeriod
        quietEndingExtension
        executionDelay
        createdAt
      }
      startDate
      totalPower
      snapshotBlock
      yeas
      nays
      quietEndingExtensionDuration
      quietEndingSnapshotSupport
      script
      isAccepted
      castVotes {
        id
        supporter {
          id
          user {
            id
            address
          }
        }
        caster
        supports
        stake
        createdAt
      }

      # Disputable data
      actionId
      challengeId
      challenger
      challengeEndDate
      disputeId
      settledAt
      settlementOffer
      disputedAt
      pausedAt
      pauseDuration
      submitterArbitratorFee {
        id
      }
      challengerArbitratorFee {
        id
      }
      collateralRequirement {
        token {
          id
          symbol
          decimals
        }
        actionAmount
        challengeAmount
        challengeDuration
      }
    }
  }
`

export const USER = gql`
  query User($id: ID!) {
    user(id: $id) {
      id
      address
      gardensSigned
      representativeFor {
        organization {
          id
        }
        user {
          id
          address
        }
      }
      supports {
        id
        user {
          id
          address
        }
        organization {
          id
        }
        representative {
          id
          address
        }
        # vote casts
        casts {
          id
          supports
          stake
          proposal {
            id
            number
            status
            metadata
            type
            organization {
              id
            }
          }
          createdAt
        }
        # proposals stakes
        stakes(orderBy: createdAt, orderDirection: desc) {
          id
          type
          proposal {
            id
            number
            status
            metadata
            type
            organization {
              id
            }
          }
          amount
          createdAt
        }
        # proposal stakes history
        stakesHistory(orderBy: createdAt, orderDirection: desc) {
          id
          type
          proposal {
            id
            number
            status
            metadata
            type

            organization {
              id
            }
          }
          totalTokensStaked
          conviction
          time
          createdAt
        }
      }
    }
  }
`

export const SUPPORTER = (type: string): DocumentNode => gql`
  ${type} Supporter($id: ID!) {
    supporter(id: $id) {
      id
      user {
        id
        address
      }
      organization {
        id
      }
      representative {
        id
        address
      }
      # vote casts
      casts {
        id
        supports
        stake
        proposal {
          id
          number
          status
          metadata
          type
        }
        createdAt

      }
      # proposals stakes
      stakes(orderBy: createdAt, orderDirection: desc) {
        id
        type
        proposal {
          id
          number
          status
          metadata
          type
        }
        amount 
        createdAt
      }
      # proposal stakes history
      stakesHistory(orderBy: createdAt, orderDirection: desc) {
        id
        type
        proposal {
          id
          number
          status
          metadata
          type
        }
        totalTokensStaked
        conviction
        time
        createdAt
      }
    }
  }
`
export const COLLATERAL_REQUIREMENT = (type: string): DocumentNode => gql`
  ${type} CollateralRequirement($proposalId: String!) {
    proposal(id: $proposalId) {
      collateralRequirement {
        id
        actionAmount
        challengeAmount
        challengeDuration
        proposal {
          id
        }
        token {
          id
          decimals
          symbol
        }
      }
    }
  }
`

export const ARBITRATOR_FEE = (type: string): DocumentNode => gql`
  ${type} ArbitratorFee($arbitratorFeeId: String!) {
    arbitratorFee(id: $arbitratorFeeId) {
      id
      amount
      proposal {
        id
      }
      token {
        id
        decimals
        symbol
      }
    }
  }
`
