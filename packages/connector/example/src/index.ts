import { connect,  } from '@aragon/connect'
import {
  connectGarden,
  Config,
  getGardens,
  getUser,
  Proposal,
  Supporter,
} from '@1hive/connect-gardens'

const ORG_ADDRESS = '0x7777cd7c9c6d3537244871ac8e73b3cb9710d45a'
type Garden = {
  id: string
  createdAt: string
  config: any
  token?: any
  wrappableToken?: any
  proposalCount: number
  supporterCount: number
  honeyLiquidity?: string
  incentivisedPriceOracle?: string
  unipool?: string
  active: boolean
}




async function main(): Promise<void> {
  console.log('\n##################Gardens:')
  const gardens = await getGardens({ network: 4 }, { first: 1000, orderBy: 'honeyLiquidity', orderDirection: 'desc' })
  gardens.map(describeGarden)

  const org = await connect(ORG_ADDRESS, 'thegraph', { network: 4 })
  console.log('\n##################Organization:', org, `(${org.address})`)

  const garden = await connectGarden(org)

  if (!garden) {
    console.log('\nNo Garden instance found')
    return
  }

  const config = await garden.config()
  console.log(`\n#################Config:`)
  describeConfig(config)
  console.log(`\n`)

  const proposals = await garden.proposals({ first: 10 })
  console.log(`\n#################Proposals:`)
  proposals.map(describeProposal)
  console.log(`\n`)

  console.log(`\n#################User:`)
  const user = await getUser({ network: 4 }, { id: "0x49c01b61aa3e4cd4c4763c78ecfe75888b49ef50" })
  describeUser(user)

  // const proposal = await garden.proposal({
  //   number: '1',
  //   appAddress: '0x00f9092e5806628d7a44e496c503cec608e64f1f',
  // })
  // console.log(`\n#################Unique Proposal:`)
  // describeProposal(proposal)
  // console.log(`\n`)

  // console.log(`#####Subscriptions\n\n`)
  // garden.onProposals({}, (err: any, proposals) => {
  //   console.log('proposals', proposals)
  //   if (err || !proposals) {
  //     return
  //   }

  //   proposals.map(describeProposal)
  // })

  // garden.onConfig((err: any, config) => {
  //   console.log('config', config)
  //   if (err || !config) {
  //     return
  //   }

  //   describeConfig(config)
  // })
}

function proposalId(proposal: Proposal): string {
  return (
    '#' +
    String(parseInt(proposal.id.match(/proposalId:(.+)$/)?.[1] || '0')).padEnd(
      2,
      ' '
    )
  )
}

function describeGarden(garden: Garden) {
  console.log(`Organization ${garden.id}`)
  console.log(`Active: ${garden.active}`)
  console.log(`CreatedAt: ${garden.createdAt}`)
  console.log(`Proposal count: ${garden.proposalCount}`)
    console.log(`Supporter count: ${garden.supporterCount}`)
  console.log(`Token: ${JSON.stringify(garden.token, null, 2)}`)
  console.log(`Wrappable token: ${garden.wrappableToken ? JSON.stringify(garden.wrappableToken, null, 2): 'No wrappable token'}`)
  console.log(`Honey liquidity: ${garden.honeyLiquidity}`)
  console.log(`\n`)
}

function describeUser(user: any) {
  console.log(`User ${user.id}`)
  console.log(`Address: ${user.address}`)
  console.log(`gardensSigned: ${user.gardensSigned}`)
  console.log(`representativesFor: ${user.representativesFor}`)
  user.supports.map(describeSupporter)
  
  console.log(`\n`)
}

function describeProposal(proposal: Proposal): void {
  console.log(`PROPOSAL ${proposalId(proposal)} ${proposal.type}`)
  console.log(`Name: ${proposal.metadata}`)
  console.log(`Link: ${proposal.link}`)
  console.log(`Requested amount: ${proposal.requestedAmount}`)
  console.log(`Beneficiary: ${proposal.beneficiary}`)
  // console.log(`Stake history: `)
  // console.log(JSON.stringify(proposal.stakesHistory, null, 2))
  // console.log(`Casts: `)
  // console.log(JSON.stringify(proposal.casts, null, 2))
  console.log(`\n`)
}

function describeConfig(config: Config): void {
  console.log(
    `Conviction config: ${JSON.stringify(config.conviction, null, 2)}`
  )
  console.log(`Voting config: ${JSON.stringify(config.voting, null, 2)}`)
}

function describeSupporter(supporter: Supporter): void {
  console.log('SUPPORTER', supporter.user.address)
  console.log('Organization', supporter.organization.id)
  console.log(`casts: ${JSON.stringify(supporter.casts, null, 2)}`)
  console.log(`stakes: ${JSON.stringify(supporter.stakes, null, 2)}`)
  console.log(
    `stakes history: ${JSON.stringify(supporter.stakesHistory, null, 2)}`
  )
}

main().catch((err) => {
  console.error('')
  console.error(err)
  console.log(
    'Please report any problem to https://github.com/aragon/connect/issues'
  )
  process.exit(1)
})
