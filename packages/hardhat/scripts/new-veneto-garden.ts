import hre, { ethers } from 'hardhat'
import { Contract } from '@ethersproject/contracts'
import { Signer } from '@ethersproject/abstract-signer'
import { GardensTemplate, ERC20, Kernel, IUnipoolFactory } from '../typechain'
import { BigNumber } from 'ethers'

const { deployments } = hre

const network = hre.network.name === 'localhost' ? 'xdai' : hre.network.name
const blockTime = network === 'rinkeby' ? 15 : network === 'mainnet' ? 13 : 5 // 15 rinkeby, 13 mainnet, 5 xdai

console.log(`Every ${blockTime}s a new block is mined in ${network}.`)

// EXISTING_TOKEN_RINKEBY = "0x31c952C47EE29058C0558475bb9E77604C52fE5f" // Not for use here, put in the config.
// EXISTING_TOKEN_XDAI = "0xa09e33C8dCb1f95f7B79d7fC75a72aaDf69eB319" // Not for use here, put in the config.
// EXISTING_TOKEN_ARBTEST = "0xEa9508cE6DCd45365d636D9730cFFA839A4A8121" // Not for use here, put in the config.
const ZERO_ADDRESS = ethers.constants.AddressZero
const ONE_HUNDRED_PERCENT = 1e18
const ISSUANCE_ONE_HUNDRED_PERCENT = 1e10
const CONVICTION_VOTING_ONE_HUNDRED_PERCENT = 1e7
const ONE_MINUTE = 60
const ONE_HOUR = 60 * ONE_MINUTE
const ONE_DAY = 24 * ONE_HOUR
const ONE_YEAR = 365 * ONE_DAY

/**
 * Get proxies from a deployed DAO
 * @param daoAddress Address of the DAO
 * @param appIds List of appIds
 * @returns Returns an object of the form { [appId]: proxy | proxy[] }
 */
const getApps = async (daoAddress: string, appIds: string[]): Promise<string[]> => {
  const dao = (await ethers.getContractAt('Kernel', daoAddress)) as Kernel
  const currentBlockNumber = await ethers.provider.getBlockNumber()
  const apps = await dao.queryFilter(dao.filters.NewAppProxy(null, null, null), currentBlockNumber - 100, 'latest').then((events) =>
    events
      .filter(({ args }) => appIds.includes(args.appId))
      .map(({ args }) => ({
        appId: args.appId,
        proxy: args.proxy,
      }))
      .reduce(
        (apps, { appId, proxy }) => ({
          ...apps,
          [appId]: !apps[appId] ? proxy : [...apps[appId], proxy],
        }),
        {}
      )
  )
  return appIds.map((appId) => apps[appId])
}

const getGardensTemplate = async (signer: Signer): Promise<GardensTemplate> => {
  const gardensTemplateAddress = (await deployments.get('GardensTemplate')).address
  return (await ethers.getContractAt('GardensTemplate', gardensTemplateAddress, signer)) as GardensTemplate
}

const getUnipoolFactory = async (signer: Signer, gardensTemplate: GardensTemplate): Promise<IUnipoolFactory> => {
  const unipoolFactoryAddress = await gardensTemplate.unipoolFactory()
  return (await ethers.getContractAt('IUnipoolFactory', unipoolFactoryAddress, signer)) as IUnipoolFactory
}

const getHoneyToken = async (signer: Signer, gardensTemplate: GardensTemplate) => {
  const honeyTokenAddress = await gardensTemplate.honeyToken()
  return (await ethers.getContractAt('ERC20', honeyTokenAddress, signer)) as ERC20
}

const getOriginalToken = async (signer: Signer, address: string) => {
  return (await ethers.getContractAt('ERC20', address, signer)) as ERC20
}

const getEventArgument = async (
  selectedFilter: string,
  arg: number | string,
  contract: Contract,
  transactionHash: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const filter = contract.filters[selectedFilter]()

    contract.on(filter, (...args) => {
      const event = args.pop()
      if (event.transactionHash === transactionHash) {
        contract.removeAllListeners(filter)
        resolve(event.args[arg])
      }
    })
  })
}

const getEventArgFromReceipt = (receipt, event, arg) => {
  return receipt.events.filter((receiptEvent) => receiptEvent.event == event)[0].args[arg]
}

const toTokens = (amount, decimals = 18) => {
  const [integer, decimal] = String(amount).split('.')
  return BigNumber.from((integer != '0' ? integer : '') + (decimal || '').padEnd(decimals, '0'))
}

const transform = (params) => ({
  gnosisSafe: params.gnosisSafe,
  gardenTokenName: params.gardenTokenName,
  gardenTokenSymbol: params.gardenTokenSymbol,
  holders: Object.entries(params.seeds).map((e) => e[0]),
  stakes: Object.entries(params.seeds).map((e) => toTokens(e[1] as number).toString()),
  commonPoolAmount: Math.floor(params.commonPoolAmount).toString(),
  honeyTokenLiquidityInXdai: toTokens(params.honeyTokenLiquidityInXdai).toString(),
  gardenTokenLiquidity: toTokens(params.gardenTokenLiquidity).toString(),
  voteSupportRequired: Math.floor(params.voteSupportRequired * ONE_HUNDRED_PERCENT).toString(),
  voteMinAcceptanceQuorum: Math.floor(params.voteMinAcceptanceQuorum * ONE_HUNDRED_PERCENT).toString(),
  voteDuration: Math.floor(params.voteDurationDays * ONE_DAY),
  delegatedVotingPeriod: Math.floor(params.delegatedVotingPeriodDays * ONE_DAY),
  voteQuietEndingPeriod: Math.floor(params.voteQuietEndingPeriodDays * ONE_DAY),
  voteQuietEndingExtension: Math.floor(params.voteQuietEndingExtensionDays * ONE_DAY),
  voteExecutionDelay: Math.floor(params.voteExecutionDelayDays * ONE_DAY),
  issuanceTargetRatio: Math.floor(params.issuanceTargetRatio * ISSUANCE_ONE_HUNDRED_PERCENT),
  issuanceMaxAdjustmentPerSecond: Math.floor((params.issuanceThrottle / ONE_YEAR) * ONE_HUNDRED_PERCENT),
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
    holders,
    stakes,
    commonPoolAmount,
    honeyTokenLiquidityInXdai,
    gardenTokenLiquidity,
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
    requestToken,
    daoId,
    agreementTitle,
    agreementContent,
    challengeDuration,
    actionAmount,
    challengeAmount,
    actionAmountStable,
    challengeAmountStable,
  } = transform(await import(`../params-veneto.json`))
  const [mainAccount] = await ethers.getSigners()

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

  const createGardenTxOne = async (gardensTemplate: GardensTemplate, log: Function): Promise<string> => {
    log(`Create garden transaction one...`)
    const createGardenTxOneTx = await gardensTemplate.createGardenTxOne(
      [ZERO_ADDRESS, gnosisSafe],
      gardenTokenName,
      gardenTokenSymbol,
      [commonPoolAmount, honeyTokenLiquidityInXdai, gardenTokenLiquidity, 0],
      [
        voteDuration,
        voteSupportRequired,
        voteMinAcceptanceQuorum,
        delegatedVotingPeriod,
        voteQuietEndingPeriod,
        voteQuietEndingExtension,
        voteExecutionDelay,
      ],
      { gasLimit: 11000000 }
    )
    log(`submitted: ${createGardenTxOneTx.hash}`)
    const createGardenTxOneReceipt = await createGardenTxOneTx.wait(1)
    const daoAddress = getEventArgFromReceipt(createGardenTxOneReceipt, 'DeployDao', 'dao')

    log(`Tx one completed: Gardens DAO (${daoAddress}) created. Gas used: ${createGardenTxOneReceipt.gasUsed}`)
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
      requestToken,
      { gasLimit: 8000000 }
    )

    // We get the event arg this way because it is emitted by a contract called by the initial contract
    // this means the args can't be decoded on the receipt directly
    const unipoolDepositorAddress = undefined

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
      { gasLimit: 10000000 }
    )
    await createGardenTxThreeTx.wait(1)
    const createGardenTxThreeReceipt = await createGardenTxThreeTx.wait(1)
    log(`Tx three completed. Gas used: ${createGardenTxThreeReceipt.gasUsed}`)
  }

  const gardensTemplate = await getGardensTemplate(mainAccount)
  await approveHnyPayment(gardensTemplate, log)
  const daoAddress = await createGardenTxOne(gardensTemplate, log)
  await createTokenholders(gardensTemplate, log)
  const [priceOracleAddress, ,] = await createGardenTxTwo(gardensTemplate, log)
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
    issuanceAddress,
    agreementAddress,
    votingAddress,
    votingAggregatorAddress,
    priceOracleAddress,
  })
  return {
    daoAddress,
    fundsManagerAddress,
    commonPoolAddress,
    convictionVotingAddress,
    tokenManagerAddress,
    issuanceAddress,
    agreementAddress,
    votingAddress,
    votingAggregatorAddress,
    priceOracleAddress,
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
