/* eslint-disable @typescript-eslint/ban-types */
import hre, { ethers } from "hardhat";
import { Signer } from "@ethersproject/abstract-signer";
import { GardensTemplate, Kernel } from "../typechain";
import { getEventArgument } from "../helpers/events";

const { deployments } = hre;

const network = hre.network.name === "localhost" ? "xdai" : hre.network.name;
const blockTime = network === "rinkeby" ? 15 : network === "mainnet" ? 13 : 5; // 15 rinkeby, 13 mainnet, 5 xdai

console.log(`Every ${blockTime}s a new block is mined in ${network}.`);

const ONE_HUNDRED_PERCENT = 1e18;
const ISSUANCE_ONE_HUNDRED_PERCENT = 1e10;
const CONVICTION_VOTING_ONE_HUNDRED_PERCENT = 1e7;
const ONE_TOKEN = 1e18;
const ONE_MINUTE = 60;
const ONE_HOUR = 60 * ONE_MINUTE;
const ONE_DAY = 24 * ONE_HOUR;
const ONE_YEAR = 365 * ONE_DAY;

/**
 * Get proxies from a deployed DAO
 * @param daoAddress Address of the DAO
 * @param appIds List of appIds
 * @returns Returns an object of the form { [appId]: proxy | proxy[] }
 */
const getApps = async (
  daoAddress: string,
  appIds: string[]
): Promise<string[]> => {
  const dao = (await ethers.getContractAt("Kernel", daoAddress)) as Kernel;
  const apps = await dao
    .queryFilter(dao.filters.NewAppProxy(null, null, null))
    .then((events) =>
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
    );
  return appIds.map((appId) => apps[appId]);
};

const gardensTemplateAddress = async (): Promise<string> =>
  (await deployments.get("GardensTemplate")).address;

const getGardensTemplate = async (signer: Signer): Promise<GardensTemplate> =>
  (await ethers.getContractAt(
    "GardensTemplate",
    await gardensTemplateAddress(),
    signer
  )) as GardensTemplate;

const transform = (params) => ({
  orgTokenName: params.orgTokenName,
  orgTokenSymbol: params.orgTokenSymbol,
  holders: Object.entries(params.seeds).map((e) => e[0]),
  stakes: Object.entries(params.seeds).map((e) =>
    Math.floor((e[1] as number) * ONE_TOKEN).toString()
  ),
  fundingPoolStake: Math.floor(params.fundingPoolStake * ONE_TOKEN).toString(),
  voteSupportRequired: Math.floor(
    params.voteSupportRequired * ONE_HUNDRED_PERCENT
  ).toString(),
  voteMinAcceptanceQuorum: Math.floor(
    params.voteMinAcceptanceQuorum * ONE_HUNDRED_PERCENT
  ).toString(),
  voteDuration: Math.floor(params.voteDurationDays * ONE_DAY),
  delegatedVotingPeriod: Math.floor(params.delegatedVotingPeriodDays * ONE_DAY),
  voteQuietEndingPeriod: Math.floor(params.voteQuietEndingPeriodDays * ONE_DAY),
  voteQuietEndingExtension: Math.floor(
    params.voteQuietEndingExtensionDays * ONE_DAY
  ),
  voteExecutionDelay: Math.floor(params.voteExecutionDelayDays * ONE_DAY),
  issuanceTargetRatio: Math.floor(
    params.issuanceTargetRatio * ISSUANCE_ONE_HUNDRED_PERCENT
  ),
  issuanceMaxAdjustmentPerSecond: Math.floor(
    (params.issuanceMaxAdjustmentPerYear / ONE_YEAR) * ONE_HUNDRED_PERCENT
  ),
  decay: Math.floor(
    (1 / 2) ** (1 / ((params.halfLifeHours * ONE_HOUR) / blockTime)) *
      CONVICTION_VOTING_ONE_HUNDRED_PERCENT
  ),
  maxRatio: Math.floor(params.maxRatio * CONVICTION_VOTING_ONE_HUNDRED_PERCENT),
  weight: Math.floor(
    params.maxRatio ** 2 *
      params.minThreshold *
      CONVICTION_VOTING_ONE_HUNDRED_PERCENT
  ),
  minThresholdStakePercentage: Math.floor(
    params.minActiveStakePct * ONE_HUNDRED_PERCENT
  ).toString(),
  challangeDuration: Math.floor(params.challangeDurationDays * ONE_DAY),
  actionAmount: Math.floor(params.actionAmount * ONE_TOKEN).toString(),
  challangeAmount: Math.floor(params.challangeAmount * ONE_TOKEN).toString(),
  stableTokenAddress: params.stableTokenAddress,
  stableTokenOracle: params.stableTokenOracle,
  daoId: params.daoId || "gardens" + Math.floor(Math.random() * 100000),
  arbitrator: params.arbitrator,
  setAppFeesCashier: params.setAppFeesCashier,
  agreementTitle: params.agreementTitle,
  agreementContent: params.agreementContent,
  stakingFactory: params.stakingFactory,
  feeToken: params.feeToken,
});

export default async function main(log = console.log): Promise<any> {
  const {
    orgTokenName,
    orgTokenSymbol,
    holders,
    stakes,
    fundingPoolStake,
    voteDuration,
    voteSupportRequired,
    voteMinAcceptanceQuorum,
    delegatedVotingPeriod,
    voteQuietEndingPeriod,
    voteQuietEndingExtension,
    voteExecutionDelay,
    issuanceTargetRatio,
    issuanceMaxAdjustmentPerSecond,
    stableTokenAddress,
    stableTokenOracle,
    decay,
    maxRatio,
    weight,
    minThresholdStakePercentage,
    daoId,
    arbitrator,
    setAppFeesCashier,
    agreementTitle,
    agreementContent,
    stakingFactory,
    feeToken,
    challangeDuration,
    actionAmount,
    challangeAmount,
  } = transform(await import(`../config/params-${network}.json`));

  const createDaoTxOne = async (
    gardensTemplate: GardensTemplate,
    log: Function
  ): Promise<string> => {
    const tx = await gardensTemplate.createDaoTxOne(
      orgTokenName,
      orgTokenSymbol,
      fundingPoolStake,
      [
        voteDuration,
        voteSupportRequired,
        voteMinAcceptanceQuorum,
        delegatedVotingPeriod,
        voteQuietEndingPeriod,
        voteQuietEndingExtension,
        voteExecutionDelay,
      ],
      { gasLimit: 9500000 }
    );

    const daoAddress = await getEventArgument(
      "DeployDao",
      "dao",
      gardensTemplate,
      tx.hash
    );

    log(`Tx one completed: Gardens DAO (${daoAddress}) created.`);

    return daoAddress;
  };

  const createTokenholders = async (
    gardensTemplate: GardensTemplate,
    log: Function
  ): Promise<void> => {
    await gardensTemplate.createTokenholders(holders, stakes, {
      gasLimit: 9500000,
    });

    log(`Tx tokenholders completed.`);
  };

  const createDaoTxTwo = async (
    gardensTemplate: GardensTemplate,
    log: Function
  ): Promise<void> => {
    await gardensTemplate.createDaoTxTwo(
      [issuanceTargetRatio, issuanceMaxAdjustmentPerSecond],
      stableTokenAddress,
      stableTokenOracle,
      [decay, maxRatio, weight, minThresholdStakePercentage],
      { gasLimit: 9500000 }
    );

    log(`Tx two completed.`);
  };

  const createDaoTxThree = async (
    gardensTemplate: GardensTemplate,
    log: Function
  ): Promise<void> => {
    await gardensTemplate.createDaoTxThree(
      daoId,
      arbitrator,
      setAppFeesCashier,
      agreementTitle,
      ethers.utils.toUtf8Bytes(agreementContent),
      stakingFactory,
      feeToken,
      challangeDuration,
      [actionAmount, challangeAmount],
      { gasLimit: 9500000 }
    );

    log(`Tx three completed.`);
  };

  const appManager = await ethers.getSigners()[0];
  const gardensTemplate = await getGardensTemplate(appManager);

  const daoAddress = await createDaoTxOne(gardensTemplate, log);
  await createTokenholders(gardensTemplate, log);
  await createDaoTxTwo(gardensTemplate, log);
  await createDaoTxThree(gardensTemplate, log);

  const [
    convictionVotingAddress,
    tokenManagerAddress,
    issuanceAddress,
    agreementAddress,
    votingAddress,
  ] = await getApps(
    daoAddress,
    await Promise.all([
      gardensTemplate.CONVICTION_VOTING_APP_ID(),
      gardensTemplate.HOOKED_TOKEN_MANAGER_APP_ID(),
      gardensTemplate.DYNAMIC_ISSUANCE_APP_ID(),
      gardensTemplate.AGREEMENT_APP_ID(),
      gardensTemplate.DISPUTABLE_VOTING_APP_ID(),
    ])
  );

  log({
    daoAddress,
    convictionVotingAddress,
    tokenManagerAddress,
    issuanceAddress,
    agreementAddress,
    votingAddress,
  });

  return {
    daoAddress,
    convictionVotingAddress,
    tokenManagerAddress,
    issuanceAddress,
    agreementAddress,
    votingAddress,
  };
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
