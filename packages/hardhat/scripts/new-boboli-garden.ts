import hre, { ethers } from 'hardhat'
import { BigNumber, Signer } from 'ethers'

import {
  getApps,
  getEventArgFromReceipt,
  getEventArgument,
  getGardensTemplate,
  getHoneyToken,
  getOriginalToken,
  getUnipoolFactory,
  toTokens,
} from '../helpers'
import { impersonateAddress } from '../helpers/rpc'
import { GardensTemplate } from '../typechain'

const network = process.env.HARDHAT_FORK
  ? process.env.HARDHAT_FORK
  : hre.network.name === 'localhost'
  ? 'xdai'
  : hre.network.name
const blockTime = network === 'rinkeby' ? 15 : network === 'mainnet' ? 13 : network === 'xdai' ? 5 : 2 // 15 rinkeby, 13 mainnet, 5 xdai, 2 polygon

console.log(`Every ${blockTime}s a new block is mined in ${network}.`)

// EXISTING_TOKEN_RINKEBY = "0xecf20ddfac09253c0f1768d270ad2536e97b605d" // Not for use here, put in the config.
// EXISTING_TOKEN_XDAI = "0xB156cfbB83ec91e56A25cA0E59ADf5a223164A3f" // Not for use here, put in the config.
// EXISTING_TOKEN_POLYGON = "0x8fe27b8172ef063de5548ac1177c63605256355a" // Not for use here, put in the config.
// EXISTING_TOKEN_ARBTEST = "0xEa9508cE6DCd45365d636D9730cFFA839A4A8121" // Not for use here, put in the config.

const ONE_HUNDRED_PERCENT = 1e18
const CONVICTION_VOTING_ONE_HUNDRED_PERCENT = 1e7
const ONE_MINUTE = 60
const ONE_HOUR = 60 * ONE_MINUTE
const ONE_DAY = 24 * ONE_HOUR

const transform = (params) => ({
  gnosisSafe: params.gnosisSafe,
  gardenTokenName: params.gardenTokenName,
  gardenTokenSymbol: params.gardenTokenSymbol,
  existingToken: process.env.EXISTING_TOKEN ? process.env.EXISTING_TOKEN : params.existingToken,
  honeyTokenLiquidityInXdai: toTokens(params.honeyTokenLiquidityInXdai).toString(),
  existingTokenLiquidity: toTokens(params.existingTokenLiquidity).toString(),
  voteSupportRequired: Math.floor(params.voteSupportRequired * ONE_HUNDRED_PERCENT).toString(),
  voteMinAcceptanceQuorum: Math.floor(params.voteMinAcceptanceQuorum * ONE_HUNDRED_PERCENT).toString(),
  voteDuration: Math.floor(params.voteDurationDays * ONE_DAY),
  delegatedVotingPeriod: Math.floor(params.delegatedVotingPeriodDays * ONE_DAY),
  voteQuietEndingPeriod: Math.floor(params.voteQuietEndingPeriodDays * ONE_DAY),
  voteQuietEndingExtension: Math.floor(params.voteQuietEndingExtensionDays * ONE_DAY),
  voteExecutionDelay: Math.floor(params.voteExecutionDelayDays * ONE_DAY),
  decay: Math.floor(
    (1 / 2) ** (1 / ((params.convictionGrowthHours * ONE_HOUR) / blockTime)) * CONVICTION_VOTING_ONE_HUNDRED_PERCENT
  ),
  maxRatio: Math.floor(params.spendingLimit * CONVICTION_VOTING_ONE_HUNDRED_PERCENT),
  weight: Math.floor(params.spendingLimit ** 2 * params.minimumConviction * CONVICTION_VOTING_ONE_HUNDRED_PERCENT),
  minThresholdStakePercentage: Math.floor(params.minActiveStakePercentage * ONE_HUNDRED_PERCENT).toString(),
  requestToken: params.requestToken,
  challengeDuration: Math.floor(params.settlementPeriod * ONE_DAY),
  actionAmount: toTokens(params.proposalDeposit).toString(),
  challengeAmount: toTokens(params.challengeDeposit).toString(),
  actionAmountStable: toTokens(params.proposalDepositStable).toString(),
  challengeAmountStable: toTokens(params.challengeDepositStable).toString(),
  daoId: params.daoId || 'gardens' + Math.floor(Math.random() * 100000),
  agreementTitle: params.agreementTitle,
  agreementContent: params.agreementContent,
})

export default async function main(log = console.log): Promise<any> {
  const {
    gnosisSafe,
    gardenTokenName,
    gardenTokenSymbol,
    existingToken,
    honeyTokenLiquidityInXdai,
    existingTokenLiquidity,
    voteDuration,
    voteSupportRequired,
    voteMinAcceptanceQuorum,
    delegatedVotingPeriod,
    voteQuietEndingPeriod,
    voteQuietEndingExtension,
    voteExecutionDelay,
    decay,
    maxRatio,
    weight,
    minThresholdStakePercentage,
    requestToken,
    daoId,
    agreementTitle,
    agreementContent,
    challengeDuration,
    actionAmount,
    challengeAmount,
    actionAmountStable,
    challengeAmountStable,
  } = transform(await import(`../params-boboli.json`))
  let mainAccount: Signer
  if (process.env.HNY_HOLDER) {
    // When we fork a network to test the template deployment we would like to impersonate an address with HNY
    mainAccount = await impersonateAddress(process.env.HNY_HOLDER)
  } else {
    mainAccount = (await ethers.getSigners())[0]
  }
  const approveHnyPayment = async (gardensTemplate: GardensTemplate, log: Function) => {
    const honeyToken = await getHoneyToken(mainAccount, gardensTemplate)
    const currentAllowance = await honeyToken.allowance(await mainAccount.getAddress(), gardensTemplate.address)
    if (currentAllowance.gt(BigNumber.from(0))) {
      const approveHoneyPaymentTx = await honeyToken.approve(gardensTemplate.address, BigNumber.from(0), {
        gasLimit: 1000000,
      })
      await approveHoneyPaymentTx.wait(1)
      log(`Pre unapproval for honey payment made.`)
    }
    const approvalAmount = BigNumber.from(100).pow(BigNumber.from(18))
    const approveHoneyPaymentTx = await honeyToken.approve(gardensTemplate.address, approvalAmount, {
      gasLimit: 1000000,
    })
    await approveHoneyPaymentTx.wait(1)
    log(`Approval for honey payment made.`)
  }

  const approveOgtPayment = async (gardensTemplate: GardensTemplate, log: Function) => {
    const originalToken = await getOriginalToken(mainAccount, existingToken)
    const approvalAmount = BigNumber.from(100).pow(BigNumber.from(18))
    const approveOriginalTokenPaymentTx = await originalToken.approve(gardensTemplate.address, approvalAmount, {
      gasLimit: 1000000,
    })
    await approveOriginalTokenPaymentTx.wait(1)
    log(`Approval for original token payment made.`)
  }

  const createGardenTxOne = async (gardensTemplate: GardensTemplate, log: Function): Promise<string> => {
    log(`Create garden transaction one...`)
    const createGardenTxOneTx = await gardensTemplate.createGardenTxOne(
      [existingToken, gnosisSafe],
      gardenTokenName,
      gardenTokenSymbol,
      [0, honeyTokenLiquidityInXdai, 0, existingTokenLiquidity],
      [
        voteDuration,
        voteSupportRequired,
        voteMinAcceptanceQuorum,
        delegatedVotingPeriod,
        voteQuietEndingPeriod,
        voteQuietEndingExtension,
        voteExecutionDelay,
      ],
      { gasLimit: 12500000 }
    )
    log(`submitted: ${createGardenTxOneTx.hash}`)
    const createGardenTxOneReceipt = await createGardenTxOneTx.wait(1)
    const daoAddress = getEventArgFromReceipt(createGardenTxOneReceipt, 'DeployDao', 'dao')

    log(`Tx one completed: Gardens DAO (${daoAddress}) created. Gas used: ${createGardenTxOneReceipt.gasUsed}`)
    return daoAddress
  }

  const createGardenTxTwo = async (gardensTemplate: GardensTemplate, log: Function): Promise<string[]> => {
    log(`Create garden transaction two...`)
    const createGardenTxTwoTx = await gardensTemplate.createGardenTxTwo(
      [0, 0],
      [decay, maxRatio, weight, minThresholdStakePercentage],
      requestToken,
      { gasLimit: 8000000 }
    )

    // We get the event arg this way because it is emitted by a contract called by the initial contract
    // this means the args can't be decoded on the receipt directly
    const unipoolDepositorAddress = await getEventArgument(
      'NewRewardDepositor',
      'unipoolRewardDepositor',
      await getUnipoolFactory(mainAccount, gardensTemplate),
      createGardenTxTwoTx.hash
    )

    const createGardenTxTwoReceipt = await createGardenTxTwoTx.wait(1)
    const priceOracleAddress = getEventArgFromReceipt(
      createGardenTxTwoReceipt,
      'GardenTransactionTwo',
      'incentivisedPriceOracle'
    )
    const unipoolAddress = getEventArgFromReceipt(createGardenTxTwoReceipt, 'GardenTransactionTwo', 'unipool')

    log(`Tx two completed. Gas used: ${createGardenTxTwoReceipt.gasUsed}`)

    return [priceOracleAddress, unipoolAddress, unipoolDepositorAddress]
  }

  const createGardenTxThree = async (gardensTemplate: GardensTemplate, log: Function): Promise<void> => {
    log(`Create garden transaction three...`)
    const createGardenTxThreeTx = await gardensTemplate.createGardenTxThree(
      daoId,
      agreementTitle,
      ethers.utils.toUtf8Bytes(agreementContent),
      challengeDuration,
      [actionAmount, challengeAmount],
      [actionAmountStable, actionAmountStable],
      [challengeAmountStable, challengeAmountStable],
      { gasLimit: 7000000 }
    )
    const createGardenTxThreeReceipt = await createGardenTxThreeTx.wait(1)
    log(`Tx three completed. Gas used: ${createGardenTxThreeReceipt.gasUsed}`)
  }

  const gardensTemplate = await getGardensTemplate(mainAccount)
  await approveHnyPayment(gardensTemplate, log)
  await approveOgtPayment(gardensTemplate, log)
  const daoAddress = await createGardenTxOne(gardensTemplate, log)
  const [priceOracleAddress, unipoolAddress, unipoolDepositorAddress] = await createGardenTxTwo(gardensTemplate, log)
  await createGardenTxThree(gardensTemplate, log)

  const [convictionVotingAddress, tokenManagerAddress, agreementAddress, votingAddress, votingAggregatorAddress] =
    await getApps(
      daoAddress,
      await Promise.all([
        gardensTemplate.CONVICTION_VOTING_APP_ID(),
        gardensTemplate.HOOKED_TOKEN_MANAGER_APP_ID(),
        gardensTemplate.AGREEMENT_APP_ID(),
        gardensTemplate.DISPUTABLE_VOTING_APP_ID(),
        gardensTemplate.VOTING_AGGREGATOR_APP_ID(),
      ])
    )

  const convictionVotingContract = await ethers.getContractAt(
    ['function fundsManager() public view returns(address)'],
    convictionVotingAddress
  )
  const fundsManagerAddress = await convictionVotingContract.fundsManager()
  const fundsManagerContract = await ethers.getContractAt(
    ['function fundsOwner() public view returns(address)'],
    fundsManagerAddress
  )
  const commonPoolAddress = await fundsManagerContract.fundsOwner()

  log({
    daoAddress,
    fundsManagerAddress,
    commonPoolAddress,
    convictionVotingAddress,
    tokenManagerAddress,
    agreementAddress,
    votingAddress,
    votingAggregatorAddress,
    priceOracleAddress,
    unipoolAddress,
    unipoolDepositorAddress,
  })
  return {
    daoAddress,
    fundsManagerAddress,
    commonPoolAddress,
    convictionVotingAddress,
    tokenManagerAddress,
    agreementAddress,
    votingAddress,
    votingAggregatorAddress,
    priceOracleAddress,
    unipoolAddress,
    unipoolDepositorAddress,
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
