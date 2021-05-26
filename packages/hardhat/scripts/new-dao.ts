/* eslint-disable @typescript-eslint/ban-types */
import { BigNumber } from 'ethers'
import hre, { ethers } from 'hardhat'
import { GardensTemplate } from '../typechain'
import { getGardensTemplate, getHoneyToken, getOriginalToken, getUnipoolFactory } from '../helpers'
import { getEventArgument, getEventArgFromReceipt, getApps } from '../utils/events'

const network = process.env.HARDHAT_FORK ? process.env.HARDHAT_FORK : hre.network.name
const blockTime = network === 'rinkeby' ? 15 : network === 'mainnet' ? 13 : 5 // 15 rinkeby, 13 mainnet, 5 xdai

console.log(`Every ${blockTime}s a new block is mined in ${network}.`)

const ZERO_ADDRESS = ethers.constants.AddressZero
// EXISTING_TOKEN_RINKEBY = "0x31c952C47EE29058C0558475bb9E77604C52fE5f" // Not for use here, put in the config.
// EXISTING_TOKEN_XDAI = "0xa09e33C8dCb1f95f7B79d7fC75a72aaDf69eB319" // Not for use here, put in the config.
const ONE_HUNDRED_PERCENT = 1e18
const ISSUANCE_ONE_HUNDRED_PERCENT = 1e10
const CONVICTION_VOTING_ONE_HUNDRED_PERCENT = 1e7
const ONE_TOKEN = 1e18
const ONE_MINUTE = 60
const ONE_HOUR = 60 * ONE_MINUTE
const ONE_DAY = 24 * ONE_HOUR
const ONE_YEAR = 365 * ONE_DAY

const bigExp = (base, exp) => BigNumber.from(10).pow(exp).mul(base)

const transform = (params) => ({
  gardenTokenName: params.gardenTokenName,
  gardenTokenSymbol: params.gardenTokenSymbol,
  holders: Object.entries(params.seeds).map((e) => e[0]),
  stakes: Object.entries(params.seeds).map((e) => bigExp(e[1], 18)),
  existingToken: params.existingToken,
  commonPoolAmount: bigExp(params.commonPoolAmount, 18),
  honeyTokenLiquidityInXdai: Math.floor(params.honeyTokenLiquidityInXdai * ONE_TOKEN).toString(),
  gardenTokenLiquidity: Math.floor(params.gardenTokenLiquidity * ONE_TOKEN).toString(),
  existingTokenLiquidity: Math.floor(params.existingTokenLiquidity * ONE_TOKEN).toString(),
  voteSupportRequired: Math.floor(params.voteSupportRequired * ONE_HUNDRED_PERCENT).toString(),
  voteMinAcceptanceQuorum: Math.floor(params.voteMinAcceptanceQuorum * ONE_HUNDRED_PERCENT).toString(),
  voteDuration: Math.floor(params.voteDurationDays * ONE_DAY),
  delegatedVotingPeriod: Math.floor(params.delegatedVotingPeriodDays * ONE_DAY),
  voteQuietEndingPeriod: Math.floor(params.voteQuietEndingPeriodDays * ONE_DAY),
  voteQuietEndingExtension: Math.floor(params.voteQuietEndingExtensionDays * ONE_DAY),
  voteExecutionDelay: Math.floor(params.voteExecutionDelayDays * ONE_DAY),
  issuanceTargetRatio: Math.floor(params.issuanceTargetRatio * ISSUANCE_ONE_HUNDRED_PERCENT),
  issuanceMaxAdjustmentPerSecond: Math.floor((params.issuanceMaxAdjustmentPerYear / ONE_YEAR) * ONE_HUNDRED_PERCENT),
  decay: Math.floor(
    (1 / 2) ** (1 / ((params.halfLifeHours * ONE_HOUR) / blockTime)) * CONVICTION_VOTING_ONE_HUNDRED_PERCENT
  ),
  maxRatio: Math.floor(params.maxRatio * CONVICTION_VOTING_ONE_HUNDRED_PERCENT),
  weight: Math.floor(params.maxRatio ** 2 * params.minThreshold * CONVICTION_VOTING_ONE_HUNDRED_PERCENT),
  minThresholdStakePercentage: Math.floor(params.minActiveStakePct * ONE_HUNDRED_PERCENT).toString(),
  challengeDuration: Math.floor(params.challengeDurationDays * ONE_DAY),
  actionAmount: Math.floor(params.actionAmount * ONE_TOKEN).toString(),
  challengeAmount: Math.floor(params.challengeAmount * ONE_TOKEN).toString(),
  actionAmountStable: Math.floor(params.actionAmountStable * ONE_TOKEN).toString(),
  challengeAmountStable: Math.floor(params.challengeAmountStable * ONE_TOKEN).toString(),
  daoId: params.daoId || 'gardens' + Math.floor(Math.random() * 100000),
  agreementTitle: params.agreementTitle,
  agreementContent: params.agreementContent,
})

export default async function main(log = console.log): Promise<any> {
  const {
    gardenTokenName,
    gardenTokenSymbol,
    holders,
    stakes,
    existingToken,
    commonPoolAmount,
    honeyTokenLiquidityInXdai,
    gardenTokenLiquidity,
    existingTokenLiquidity,
    voteDuration,
    voteSupportRequired,
    voteMinAcceptanceQuorum,
    delegatedVotingPeriod,
    voteQuietEndingPeriod,
    voteQuietEndingExtension,
    voteExecutionDelay,
    issuanceTargetRatio,
    issuanceMaxAdjustmentPerSecond,
    decay,
    maxRatio,
    weight,
    minThresholdStakePercentage,
    daoId,
    agreementTitle,
    agreementContent,
    challengeDuration,
    actionAmount,
    challengeAmount,
    actionAmountStable,
    challengeAmountStable,
  } = transform(await import(`../config/params-${network}.json`))
  const [mainAccount] = await ethers.getSigners()

  const createNewToken = existingToken == ZERO_ADDRESS // As opposed bring your own token

  const approveHnyPayment = async (gardensTemplate: GardensTemplate, log: Function) => {
    const honeyToken = await getHoneyToken(mainAccount, gardensTemplate)
    const currentAllowance = await honeyToken.allowance(mainAccount.address, gardensTemplate.address)
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
      existingToken,
      gardenTokenName,
      gardenTokenSymbol,
      [commonPoolAmount, honeyTokenLiquidityInXdai, gardenTokenLiquidity, existingTokenLiquidity],
      [
        voteDuration,
        voteSupportRequired,
        voteMinAcceptanceQuorum,
        delegatedVotingPeriod,
        voteQuietEndingPeriod,
        voteQuietEndingExtension,
        voteExecutionDelay,
      ],
      { gasLimit: 9850000 }
    )
    const createGardenTxOneReceipt = await createGardenTxOneTx.wait(1)
    const daoAddress = getEventArgFromReceipt(createGardenTxOneReceipt, 'DeployDao', 'dao')

    log(`Tx one completed: Gardens DAO (${daoAddress}) created.`)
    return daoAddress
  }

  const createTokenholders = async (gardensTemplate: GardensTemplate, log: Function): Promise<void> => {
    log(`Create token holders...`)
    const createTokenHoldersTx = await gardensTemplate.createTokenHolders(holders, stakes, { gasLimit: 5000000 })
    await createTokenHoldersTx.wait(1)
    log(`Tx create token holders completed.`)
  }

  const createGardenTxTwo = async (gardensTemplate: GardensTemplate, log: Function): Promise<string[]> => {
    log(`Create garden transaction two...`)
    const createGardenTxTwoTx = await gardensTemplate.createGardenTxTwo(
      [issuanceTargetRatio, issuanceMaxAdjustmentPerSecond],
      [decay, maxRatio, weight, minThresholdStakePercentage],
      { gasLimit: 9500000 }
    )

    // We get the event arg this way because it is emitted by a contract called by the initial contract
    // this means the args can't be decoded on the receipt directly
    const unipoolDepositorAddress = createNewToken
      ? undefined
      : await getEventArgument(
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

    log(`Tx two completed.`)

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
      { gasLimit: 9500000 }
    )
    await createGardenTxThreeTx.wait(1)
    log(`Tx three completed.`)
  }

  const gardensTemplate = await getGardensTemplate(mainAccount)
  // await approveHnyPayment(gardensTemplate, log)
  // if (!createNewToken) {
  //   await approveOgtPayment(gardensTemplate, log)
  // }
  const daoAddress = await createGardenTxOne(gardensTemplate, log)
  if (createNewToken) {
    await createTokenholders(gardensTemplate, log)
  }
  const [priceOracleAddress, unipoolAddress, unipoolDepositorAddress] = await createGardenTxTwo(gardensTemplate, log)
  await createGardenTxThree(gardensTemplate, log)

  const [
    convictionVotingAddress,
    tokenManagerAddress,
    issuanceAddress,
    agreementAddress,
    votingAddress,
    votingAggregatorAddress,
  ] = await getApps(
    daoAddress,
    await Promise.all([
      gardensTemplate.CONVICTION_VOTING_APP_ID(),
      gardensTemplate.HOOKED_TOKEN_MANAGER_APP_ID(),
      gardensTemplate.DYNAMIC_ISSUANCE_APP_ID(),
      gardensTemplate.AGREEMENT_APP_ID(),
      gardensTemplate.DISPUTABLE_VOTING_APP_ID(),
      gardensTemplate.VOTING_AGGREGATOR_APP_ID(),
    ])
  )

  log({
    daoAddress,
    convictionVotingAddress,
    tokenManagerAddress,
    issuanceAddress,
    agreementAddress,
    votingAddress,
    votingAggregatorAddress,
    priceOracleAddress,
    unipoolAddress,
    unipoolDepositorAddress,
  })
  return {
    daoAddress,
    convictionVotingAddress,
    tokenManagerAddress,
    issuanceAddress,
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
