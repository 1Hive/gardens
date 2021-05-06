import { Contract } from '@ethersproject/contracts'
import { BigNumber } from '@ethersproject/bignumber'
import { ethers, network } from 'hardhat'
import { arbitratorAbi, stakingAbi, stakingFactoryAbi } from '../helpers/abis'
import { getEventArgument } from '../helpers/events'
import { Agreement, DisputableVoting, IConvictionVoting, MiniMeToken } from '../typechain'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'

const bigExp = (base, exp) => BigNumber.from(10).pow(exp).mul(base)

const REQUESTED_AMOUNT = bigExp(100, 18)
const STAKE_AMOUNT = bigExp(2, 18)
const MIN_BALANCE = bigExp(1, 18)
const LARGE_AMOUNT = bigExp(100000, 18)
const SETTLEMENT_AMOUNT = bigExp(1, 16)

const EMPTY_CALLS_SCRIPT = `0x${String(1).padStart(8, '0')}`

const FORKED_NETOWRK = 'xdai'

const overrides = {
  gasLimit: 9500000,
}

export default async function main(): Promise<any> {
  const [beneficiary, challenger] = await ethers.getSigners()

  const {
    arbitrator: arbitratorAddress,
    feeToken: feeTokenAddress,
    stakingFactory: stakingFactoryAddress,
  } = await import(`../config/params-${network.name == 'localhost' ? FORKED_NETOWRK : network.name}.json`)

  const { agreementAddress, disputableConvictionVotingAddress, disputableVotingAddress } = await import(
    `../config/mock-${network.name == 'localhost' ? FORKED_NETOWRK : network.name}.json`
  )

  const agreementArtifact = await import('@1hive/apps-agreement/artifacts/Agreement.json')

  const agreement = (await ethers.getContractAt(agreementArtifact.abi, agreementAddress)) as Agreement

  const convictionVoting = (await ethers.getContractAt(
    'IConvictionVoting',
    disputableConvictionVotingAddress
  )) as IConvictionVoting

  const disputableVoting = (await ethers.getContractAt('DisputableVoting', disputableVotingAddress)) as DisputableVoting

  const feeToken = (await ethers.getContractAt('MiniMeToken', feeTokenAddress)) as MiniMeToken

  const stakingFactory = await ethers.getContractAt(stakingFactoryAbi, stakingFactoryAddress)

  const stakingAddress = await stakingFactory.getInstance(feeTokenAddress)

  const staking = await ethers.getContractAt(stakingAbi, stakingAddress)

  const arbitrator = await ethers.getContractAt(arbitratorAbi, arbitratorAddress)

  if ((await agreement.getSigner(beneficiary.address)).mustSign) {
    console.log('\nSigning the agreement...')
    const currentSettingId = await agreement.getCurrentSettingId()
    await agreement.sign(currentSettingId)
  }

  /*********************************
   * TRANSFER AND APPROVE BALANCES *
   *********************************/

  const challangerBalance = await feeToken.balanceOf(challenger.address)
  if (challangerBalance.lt(MIN_BALANCE)) {
    console.log(`Sending challanger fee tokens...`)
    await feeToken.transfer(challenger.address, STAKE_AMOUNT)
  }

  const totalStaked = (await staking.getBalancesOf(beneficiary.address)).staked
  if (
    totalStaked.lt(MIN_BALANCE) ||
    totalStaked.sub((await staking.getBalancesOf(beneficiary.address)).locked).lt(MIN_BALANCE)
  ) {
    await approveFeeToken(feeToken, beneficiary, staking.address, LARGE_AMOUNT)
    console.log(`Staking to stake manager...`)
    await staking.stake(STAKE_AMOUNT, ethers.constants.HashZero, overrides)
  }

  if ((await staking.getLock(beneficiary.address, agreement.address)).allowance.eq(BigNumber.from(0))) {
    console.log(`Allowing stake manager...`)
    await staking.allowManager(agreement.address, LARGE_AMOUNT, ethers.constants.HashZero)
  }

  /************************************
   * CREATE CONVICTION VOTING ACTIONS *
   ************************************/

  console.log('\nCreating non challenged proposal action...')
  await newProposal(beneficiary, agreement, convictionVoting, 'Proposal 1', 'Context for action 1')

  console.log('\nCreating challenged proposal action...')
  const challengedConvictionActionId = await newProposal(
    beneficiary,
    agreement,
    convictionVoting,
    'Proposal 2',
    'Context for action 2'
  )
  await challenge(
    challenger,
    agreement,
    challengedConvictionActionId,
    'Challenge context for action 2',
    feeToken,
    arbitrator,
    convictionVoting
  )

  console.log('\nCreating settled proposal action...')
  const settledConvictionActionId = await newProposal(
    beneficiary,
    agreement,
    convictionVoting,
    'Proposal 3',
    'Context for action 3'
  )
  await challenge(
    challenger,
    agreement,
    settledConvictionActionId,
    'Challenge context for action 3',
    feeToken,
    arbitrator,
    convictionVoting
  )
  await settle(agreement, settledConvictionActionId)

  console.log('\nCreating disputed proposal action...')
  const disputedConvictionActionId = await newProposal(
    beneficiary,
    agreement,
    convictionVoting,
    'Proposal 4',
    'Context for action 4'
  )
  await challenge(
    challenger,
    agreement,
    disputedConvictionActionId,
    'Challenge context for action 4',
    feeToken,
    arbitrator,
    convictionVoting
  )
  await dispute(beneficiary, agreement, disputedConvictionActionId, feeToken, arbitrator)

  /************************************
   * CREATE DISPUTABLE VOTING ACTIONS *
   ************************************/

  console.log('\nCreating non challenged vote action...')
  await newVote(agreement, disputableVoting, 'Non challenged vote 1')

  console.log('\nCreating challenged vote action...')
  const challengedVotingActionId = await newVote(agreement, disputableVoting, 'Vote 2')
  await challenge(
    beneficiary,
    agreement,
    challengedVotingActionId,
    'Challenge context for action 6',
    feeToken,
    arbitrator,
    disputableVoting
  )

  console.log('\nCreating settled vote action...')
  const settledVotingActionId = await newVote(agreement, disputableVoting, 'Vote 3')
  await challenge(
    beneficiary,
    agreement,
    settledVotingActionId,
    'Challenge context for action 7',
    feeToken,
    arbitrator,
    disputableVoting
  )
  await settle(agreement, settledVotingActionId)

  console.log('\nCreating disputed vote action...')
  const disputedVotingActionId = await newVote(agreement, disputableVoting, 'Vote 4')
  await challenge(
    beneficiary,
    agreement,
    disputedVotingActionId,
    'Challenge context for action 8',
    feeToken,
    arbitrator,
    disputableVoting
  )
  await dispute(beneficiary, agreement, disputedVotingActionId, feeToken, arbitrator)
}

async function newVote(agreement: Agreement, voting: DisputableVoting, context: string) {
  console.log('Creating vote action...')
  const response = await voting.newVote(EMPTY_CALLS_SCRIPT, ethers.utils.formatBytes32String(context))
  const receipt = await response.wait()
  const actionId = await getEventArgument('ActionSubmitted', 'actionId', agreement, receipt.transactionHash)
  console.log(`Created vote action ID ${actionId}`)
  return actionId
}

async function newProposal(
  beneficiary: SignerWithAddress,
  agreement: Agreement,
  convictionVoting: IConvictionVoting,
  title: string,
  context: string
) {
  console.log('Creating action/proposal...')
  const addProposalRsponse = await convictionVoting.addProposal(
    title,
    ethers.utils.formatBytes32String(context),
    REQUESTED_AMOUNT,
    false,
    beneficiary.address,
    overrides
  )
  const addProposalReceipt = await addProposalRsponse.wait()
  const actionId = await getEventArgument('ActionSubmitted', 'actionId', agreement, addProposalReceipt.transactionHash)
  console.log(`Created action ID ${actionId}`)
  return actionId
}

async function challenge(
  challenger: SignerWithAddress,
  agreement: Agreement,
  actionId: string,
  context: string,
  feeToken: MiniMeToken,
  arbitrator: Contract,
  disputableApp: DisputableVoting | IConvictionVoting
) {
  console.log('Approving dispute fees from challenger.address...')
  const { feeAmount } = await arbitrator.getDisputeFees()

  const { currentCollateralRequirementId } = await agreement.getDisputableInfo(disputableApp.address)
  const { collateralToken: collateralTokenAddress, challengeAmount } = await agreement.getCollateralRequirement(
    disputableApp.address,
    currentCollateralRequirementId
  )
  console.log('Fee token address', feeToken.address)
  const collateralToken = await ethers.getContractAt('IERC20', collateralTokenAddress)
  console.log(
    'Collateral Token:',
    collateralTokenAddress,
    'Challange Amount:',
    challengeAmount.toString(),
    'Balance: ',
    (await collateralToken.balanceOf(challenger.address)).toString()
  )

  console.log(
    'Challenger:',
    challenger.address,
    'Fee amount:',
    feeAmount.toString(),
    'Balance: ',
    (await feeToken.balanceOf(challenger.address)).toString()
  )
  await approveFeeToken(feeToken, challenger, agreement.address, feeAmount.add(challengeAmount))
  console.log('Challenging action')
  // Make sure the challenger.address has funds to challenge, if new tokens they won't have.
  await agreement
    .connect(challenger)
    .challengeAction(actionId, SETTLEMENT_AMOUNT, true, ethers.utils.formatBytes32String(context), overrides)
  console.log(`Challenged action ID ${actionId}`)
}

async function settle(agreement: Agreement, actionId: string) {
  console.log('Settling action')
  await agreement.settleAction(actionId)
  console.log(`Settled action ID ${actionId}`)
}

async function dispute(
  beneficary: SignerWithAddress,
  agreement: Agreement,
  actionId: string,
  feeToken: MiniMeToken,
  arbitrator: Contract
) {
  console.log('Approving dispute fees from submitter')

  const { lastChallengeId, lastChallengeActive } = await agreement.getAction(actionId)
  console.log('Last challenge active', lastChallengeActive.toString())
  const { endDate } = await agreement.getChallenge(lastChallengeId)
  console.log('End date:', endDate.toString(), 'Timestamp:', (await ethers.provider.getBlock('latest')).timestamp)

  const { feeAmount } = await arbitrator.getDisputeFees()
  await approveFeeToken(feeToken, beneficary, agreement.address, feeAmount)
  console.log('Disputing action...')
  await agreement.disputeAction(actionId, true)
  console.log(`Disputing action ID ${actionId}`)
}

async function approveFeeToken(token: MiniMeToken, from: SignerWithAddress, to: string, amount: BigNumber) {
  const allowance = await token.allowance(from.address, to)
  if (allowance.gt(amount)) {
    return
  }
  if (allowance.gt(BigNumber.from(0))) {
    console.log('Removing previous approval...')
    await token.connect(from).approve(to, 0)
    console.log('Removed previous approval')
  }
  const newAllowance = amount.add(allowance)
  await token.generateTokens(from.address, amount)
  console.log('Executing approve...')
  return token.connect(from).approve(to, newAllowance, { ...overrides })
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })