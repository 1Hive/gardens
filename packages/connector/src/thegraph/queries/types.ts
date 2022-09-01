// Generated with https://graphql-code-generator.com/#live-demo

// 1. Get schema from subgraph
// 2. Paste in generator (https://graphql-code-generator.com/#live-demo)
// 3. Add on top:
/*
     directive @entity on OBJECT
     directive @derivedFrom(field: String) on FIELD_DEFINITION
     scalar BigInt
     scalar Bytes
 */
// 4. Generate and paste output here

export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  BigInt: any
  Bytes: any
}

export type Organization = {
  __typename?: 'Organization'
  id: Scalars['ID']
  createdAt: Scalars['BigInt']
  config: Config
  token?: Maybe<Token>
  wrappableToken?: Maybe<Token>
  proposalCount: Scalars['Int']
  proposals?: Maybe<Array<Proposal>>
  supporterCount: Scalars['Int']
  honeyLiquidity?: Maybe<Scalars['BigInt']>
  incentivisedPriceOracle?: Maybe<Scalars['Bytes']>
  unipool?: Maybe<Scalars['Bytes']>
  fluidProposals?: Maybe<Scalars['Bytes']>
  active: Scalars['Boolean']
}

export type Config = {
  __typename?: 'Config'
  id: Scalars['ID']
  conviction?: Maybe<ConvictionConfig>
  voting?: Maybe<VotingConfig>
}

export type ConvictionConfig = {
  __typename?: 'ConvictionConfig'
  id: Scalars['ID']
  decay: Scalars['BigInt']
  weight: Scalars['BigInt']
  maxRatio: Scalars['BigInt']
  pctBase: Scalars['BigInt']
  stakeToken?: Maybe<Token>
  totalStaked: Scalars['BigInt']
  maxStakedProposals: Scalars['Int']
  minThresholdStakePercentage: Scalars['BigInt']
  vault?: Maybe<Scalars['Bytes']>
  requestToken?: Maybe<Token>
  stableToken?: Maybe<Token>
  stableTokenOracle?: Maybe<Scalars['Bytes']>
  contractPaused?: Maybe<Scalars['Boolean']>
}

export type VotingConfig = {
  __typename?: 'VotingConfig'
  id: Scalars['ID']
  token?: Maybe<Token>
  settingId: Scalars['BigInt']
  voteTime: Scalars['BigInt']
  supportRequiredPct: Scalars['BigInt']
  minimumAcceptanceQuorumPct: Scalars['BigInt']
  delegatedVotingPeriod: Scalars['BigInt']
  quietEndingPeriod: Scalars['BigInt']
  quietEndingExtension: Scalars['BigInt']
  executionDelay: Scalars['BigInt']
  createdAt: Scalars['BigInt']
}

export type Proposal = {
  __typename?: 'Proposal'
  id: Scalars['ID']
  organization: Organization
  number: Scalars['BigInt']
  creator: Scalars['Bytes']
  status: ProposalStatus
  statusInt: Scalars['Int']
  type: ProposalType
  typeInt: Scalars['Int']
  createdAt: Scalars['BigInt']
  weight: Scalars['BigInt']
  metadata?: Maybe<Scalars['String']>
  executedAt?: Maybe<Scalars['BigInt']>
  link?: Maybe<Scalars['String']>
  stakes?: Maybe<Array<Stake>>
  stakesHistory?: Maybe<Array<StakeHistory>>
  beneficiary?: Maybe<Scalars['Bytes']>
  convictionLast?: Maybe<Scalars['BigInt']>
  requestedAmount?: Maybe<Scalars['BigInt']>
  totalTokensStaked?: Maybe<Scalars['BigInt']>
  stable?: Maybe<Scalars['Boolean']>
  setting?: Maybe<VotingConfig>
  startDate?: Maybe<Scalars['BigInt']>
  totalPower?: Maybe<Scalars['BigInt']>
  snapshotBlock: Scalars['BigInt']
  yeas?: Maybe<Scalars['BigInt']>
  nays?: Maybe<Scalars['BigInt']>
  quietEndingExtensionDuration?: Maybe<Scalars['BigInt']>
  quietEndingSnapshotSupport?: Maybe<VoterState>
  script?: Maybe<Scalars['Bytes']>
  isAccepted?: Maybe<Scalars['Boolean']>
  castVotes?: Maybe<Array<Cast>>
  actionId: Scalars['BigInt']
  disputeId?: Maybe<Scalars['BigInt']>
  challengeId: Scalars['BigInt']
  challenger: Scalars['Bytes']
  challengeEndDate: Scalars['BigInt']
  settledAt: Scalars['BigInt']
  settlementOffer?: Maybe<Scalars['BigInt']>
  disputedAt: Scalars['BigInt']
  pausedAt: Scalars['BigInt']
  pauseDuration: Scalars['BigInt']
  submitterArbitratorFee?: Maybe<ArbitratorFee>
  challengerArbitratorFee?: Maybe<ArbitratorFee>
  collateralRequirement?: Maybe<CollateralRequirement>
}

export type Cast = {
  __typename?: 'Cast'
  id: Scalars['ID']
  supporter: Supporter
  caster: Scalars['Bytes']
  proposal: Proposal
  supports: Scalars['Boolean']
  stake: Scalars['BigInt']
  createdAt: Scalars['BigInt']
}

export type Stake = {
  __typename?: 'Stake'
  id: Scalars['ID']
  type: StakeType
  supporter: Supporter
  proposal: Proposal
  amount: Scalars['BigInt']
  createdAt: Scalars['BigInt']
}

export type StakeHistory = {
  __typename?: 'StakeHistory'
  id: Scalars['ID']
  type: StakeType
  supporter: Supporter
  proposal: Proposal
  tokensStaked: Scalars['BigInt']
  totalTokensStaked: Scalars['BigInt']
  conviction: Scalars['BigInt']
  time: Scalars['BigInt']
  createdAt: Scalars['BigInt']
}

export type User = {
  __typename?: 'User'
  id: Scalars['ID']
  address: Scalars['Bytes']
  gardensSigned?: Maybe<Array<Scalars['String']>>
  supports: Array<Supporter>
}

export type Supporter = {
  __typename?: 'Supporter'
  id: Scalars['ID']
  user: User
  organization: Organization
  representative?: Maybe<Scalars['Bytes']>
  casts?: Maybe<Array<Cast>>
  stakes?: Maybe<Array<Stake>>
  stakesHistory?: Maybe<Array<StakeHistory>>
}

export type Token = {
  __typename?: 'Token'
  id: Scalars['ID']
  name: Scalars['String']
  symbol: Scalars['String']
  decimals: Scalars['Int']
  organization?: Maybe<Organization>
}

export type CollateralRequirement = {
  __typename?: 'CollateralRequirement'
  id: Scalars['ID']
  proposal?: Maybe<Proposal>
  token?: Maybe<Token>
  actionAmount?: Maybe<Scalars['BigInt']>
  challengeAmount?: Maybe<Scalars['BigInt']>
  challengeDuration?: Maybe<Scalars['BigInt']>
}

export enum ProposalStatus {
  Active = 'Active',
  Cancelled = 'Cancelled',
  Executed = 'Executed',
  Challenged = 'Challenged',
  Disputed = 'Disputed',
  Rejected = 'Rejected',
  Settled = 'Settled',
}

export enum ProposalType {
  Suggestion = 'Suggestion',
  Proposal = 'Proposal',
  Decision = 'Decision',
}

export enum StakeType {
  Add = 'Add',
  Withdraw = 'Withdraw',
}

export enum VoterState {
  Absent = 'Absent',
  Yea = 'Yea',
  Nay = 'Nay',
}

export type ArbitratorFee = {
  __typename?: 'ArbitratorFee'
  id: Scalars['ID']
  proposal: Proposal
  token: Token
  amount: Scalars['BigInt']
}
