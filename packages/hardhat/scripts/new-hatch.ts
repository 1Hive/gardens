import hre, { ethers } from "hardhat";
import { Contract } from "@ethersproject/contracts";
import { Signer } from "@ethersproject/abstract-signer";
import { ERC20, HatchTemplate, IHatch, IImpactHours, Kernel, MiniMeToken } from "../typechain";
import { impersonateAddress } from "../helpers/rpc";
import getParams from "../params";

const { deployments } = hre;

export interface HatchContext {
  hatchUser?: Signer;
  dao?: Kernel;
  hatch?: IHatch;
  contributionToken?: ERC20;
  hatchToken?: ERC20;
  impactHours?: IImpactHours;
  impactHoursClonedToken?: MiniMeToken;
  impactHoursToken?: MiniMeToken;
}

// Script arguments
const DAO_ID = "testtec" + Math.random(); // Note this must be unique for each deployment, change it for subsequent deployments
const NETWORK_ARG = "--network";
const DAO_ID_ARG = "--daoid";

const argValue = (arg, defaultValue) =>
  process.argv.includes(arg) ? process.argv[process.argv.indexOf(arg) + 1] : defaultValue;

const network = () => argValue(NETWORK_ARG, "local");
const daoId = () => argValue(DAO_ID_ARG, DAO_ID);

const BLOCKTIME = network() === "rinkeby" ? 15 : network() === "mainnet" ? 13 : 5; // 15 rinkeby, 13 mainnet, 5 xdai

console.log(`Every ${BLOCKTIME}s a new block is mined in ${network()}.`);

const {
  ORG_TOKEN_NAME,
  ORG_TOKEN_SYMBOL,
  SUPPORT_REQUIRED,
  MIN_ACCEPTANCE_QUORUM,
  VOTE_DURATION_BLOCKS,
  VOTE_BUFFER_BLOCKS,
  VOTE_EXECUTION_DELAY_BLOCKS,
  COLLATERAL_TOKEN,
  IH_TOKEN,
  EXPECTED_RAISE_PER_IH,
  ONE_TOKEN,
  HATCH_MIN_GOAL,
  HATCH_MAX_GOAL,
  HATCH_PERIOD,
  HATCH_EXCHANGE_RATE,
  VESTING_CLIFF_PERIOD,
  VESTING_COMPLETE_PERIOD,
  HATCH_TRIBUTE,
  OPEN_DATE,
  MAX_IH_RATE,
  TOLLGATE_FEE,
  SCORE_TOKEN,
  HATCH_ORACLE_RATIO,
} = getParams(BLOCKTIME);

// There are multiple ERC20 paths. We need to specify one.
const ERC20Path = "@aragon/os/contracts/lib/token/ERC20.sol:ERC20";

const hatchTemplateAddress = async () => (await deployments.get("HatchTemplate")).address;

const getHatchTemplate = async (signer: Signer): Promise<HatchTemplate> =>
  (await ethers.getContractAt("HatchTemplate", await hatchTemplateAddress(), signer)) as HatchTemplate;

const getAppAddresses = async (dao: Kernel, ensNames: string[]): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const inputAppIds = ensNames.map(ethers.utils.namehash);
    const proxies: string[] = [];

    dao.on("NewAppProxy", (proxy, isUpgradeable, appId, event) => {
      const index = inputAppIds.indexOf(appId);
      if (index >= 0) {
        proxies[index] = proxy;
      }
      if (proxies.length === ensNames.length) {
        dao.removeAllListeners("NewAppProxy");
        resolve(proxies);
      }
    });
  });
};

const getAddress = async (selectedFilter: string, contract: Contract, transactionHash: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const filter = contract.filters[selectedFilter]();

    contract.on(filter, (contractAddress, event) => {
      if (event.transactionHash === transactionHash) {
        contract.removeAllListeners(filter);
        resolve(contractAddress);
      }
    });
  });
};

const createDaoTxOne = async (context: HatchContext, appManager: Signer, log: Function): Promise<void> => {
  const hatchTemplate = await getHatchTemplate(appManager);
  const tx = await hatchTemplate.createDaoTxOne(
    ORG_TOKEN_NAME,
    ORG_TOKEN_SYMBOL,
    [SUPPORT_REQUIRED, MIN_ACCEPTANCE_QUORUM, VOTE_DURATION_BLOCKS, VOTE_BUFFER_BLOCKS, VOTE_EXECUTION_DELAY_BLOCKS],
    COLLATERAL_TOKEN
  );

  await tx.wait();

  const daoAddress = await getAddress("DeployDao", hatchTemplate, tx.hash);
  const dao = (await ethers.getContractAt("Kernel", daoAddress)) as Kernel;

  context.dao = dao;

  log(`Tx one completed: Hatch DAO (${daoAddress}) created. Dandelion Voting and Hooked Token Manager set up.`);
};

const createDaoTxTwo = async (context: HatchContext, appManager: Signer, log: Function): Promise<void> => {
  const hatchTemplate = await getHatchTemplate(appManager);
  const hatchUser = context.hatchUser ? context.hatchUser : appManager;
  const impactHoursToken = (await ethers.getContractAt("MiniMeToken", IH_TOKEN, appManager)) as MiniMeToken;

  const totalImpactHours = await impactHoursToken.totalSupply();
  const expectedRaise = EXPECTED_RAISE_PER_IH.mul(totalImpactHours).div(ONE_TOKEN);

  const tx = await hatchTemplate.createDaoTxTwo(
    HATCH_MIN_GOAL,
    HATCH_MAX_GOAL,
    HATCH_PERIOD,
    HATCH_EXCHANGE_RATE,
    VESTING_CLIFF_PERIOD,
    VESTING_COMPLETE_PERIOD,
    HATCH_TRIBUTE,
    OPEN_DATE,
    IH_TOKEN,
    MAX_IH_RATE,
    expectedRaise
  );

  const [hatchAddress, impactHoursAddress] = await getAppAddresses(context.dao, [
    "marketplace-hatch.open.aragonpm.eth",
    "impact-hours-beta.open.aragonpm.eth",
  ]);

  context.hatch = (await ethers.getContractAt("IHatch", hatchAddress, hatchUser)) as IHatch;
  context.contributionToken = (await ethers.getContractAt(
    ERC20Path,
    await context.hatch.contributionToken(),
    hatchUser
  )) as ERC20;
  context.hatchToken = (await ethers.getContractAt(ERC20Path, await context.hatch.token(), hatchUser)) as ERC20;
  context.impactHours = (await ethers.getContractAt("IImpactHours", impactHoursAddress, hatchUser)) as IImpactHours;
  context.impactHoursClonedToken = (await ethers.getContractAt(
    "MiniMeToken",
    await context.impactHours.token(),
    hatchUser
  )) as MiniMeToken;
  context.impactHoursToken = (await ethers.getContractAt(
    "MiniMeToken",
    await context.impactHoursClonedToken.parentToken(),
    hatchUser
  )) as MiniMeToken;

  log(`Tx two completed: Impact Hours app and Hatch app set up.`);

  await tx.wait();
};

const createDaoTxThree = async (context: HatchContext, appManager: Signer, log: Function): Promise<void> => {
  const hatchTemplate = await getHatchTemplate(appManager);

  const tx = await hatchTemplate.createDaoTxThree(
    daoId(),
    [COLLATERAL_TOKEN],
    COLLATERAL_TOKEN,
    TOLLGATE_FEE,
    SCORE_TOKEN,
    HATCH_ORACLE_RATIO
  );

  await tx.wait();

  log(`Tx three completed: Tollgate, Redemptions and Conviction Voting apps set up.`);
};

export default async function main(hatchUserAddress?: string, log = console.log) {
  const hatchTemplateContext = {} as HatchContext;
  const appManager = await ethers.getSigners()[0];

  if (hatchUserAddress) {
    hatchTemplateContext.hatchUser = await impersonateAddress(hatchUserAddress);
  }

  await createDaoTxOne(hatchTemplateContext, appManager, log);
  await createDaoTxTwo(hatchTemplateContext, appManager, log);
  await createDaoTxThree(hatchTemplateContext, appManager, log);

  return hatchTemplateContext;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
