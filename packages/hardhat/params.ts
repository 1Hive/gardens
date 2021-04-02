import { ethers } from "ethers";

const { BigNumber } = ethers;

// Helpers, no need to change
const HOURS = 60 * 60;
const DAYS = 24 * HOURS;
const ONE_HUNDRED_PERCENT = 1e18;
const ONE_TOKEN = BigNumber.from((1e18).toString());
const FUNDRAISING_ONE_HUNDRED_PERCENT = 1e6;
const FUNDRAISING_ONE_TOKEN = BigNumber.from((1e18).toString());
const PPM = 1000000;

// Collateral Token is used to pay contributors and held in the bonding curve reserve
const COLLATERAL_TOKEN = "0xfb8f60246d56905866e12443ec0836ebfb3e1f2e"; // tDAI

// Org Token represents membership in the community and influence in proposals
const ORG_TOKEN_NAME = "Token Engineering Commons TEST Hatch Token";
const ORG_TOKEN_SYMBOL = "TESTTECH";

// # Hatch Oracle Settings

// Score membership token is used to check how much members can contribute to the hatch
const SCORE_TOKEN = "0xc4fbe68522ba81a28879763c3ee33e08b13c499e"; // CSTK Token on xDai
const SCORE_ONE_TOKEN = BigNumber.from(1);
// Ratio contribution tokens allowed per score membership token
const HATCH_ORACLE_RATIO = BigNumber.from(0.8 * PPM)
  .mul(FUNDRAISING_ONE_TOKEN)
  .div(SCORE_ONE_TOKEN);

// # Dandelion Voting Settings
// Used for administrative or binary choice decisions with ragequit-like functionality on Dandelion Voting
const VOTE_DURATION = 3 * DAYS;
const VOTE_BUFFER = 3 * DAYS;
const VOTE_EXECUTION_DELAY = 24 * HOURS;
const SUPPORT_REQUIRED = String(0.6 * ONE_HUNDRED_PERCENT);
const MIN_ACCEPTANCE_QUORUM = String(0.02 * ONE_HUNDRED_PERCENT);

// Set the fee paid to the org to create an administrative vote
const TOLLGATE_FEE = BigNumber.from(3).mul(ONE_TOKEN);

// # Hatch settings

// How many COLLATERAL_TOKEN's are required to Hatch
const HATCH_MIN_GOAL = BigNumber.from(5).mul(ONE_TOKEN);
// What is the Max number of COLLATERAL_TOKEN's the Hatch can recieve
const HATCH_MAX_GOAL = BigNumber.from(1000).mul(ONE_TOKEN);
// How long should the hatch period last
const HATCH_PERIOD = 15 * DAYS;
// How many organization tokens should be minted per collateral token
const HATCH_EXCHANGE_RATE = BigNumber.from(10000 * PPM)
  .mul(ONE_TOKEN)
  .div(FUNDRAISING_ONE_TOKEN);
// When does the cliff for vesting restrictions end
const VESTING_CLIFF_PERIOD = HATCH_PERIOD + 1; // 1 second after hatch
// When will the Hatchers be fully vested and able to use the redemptions app
const VESTING_COMPLETE_PERIOD = VESTING_CLIFF_PERIOD + 1; // 2 seconds after hatch
// What percentage of Hatch contributions should go to the Funding Pool and therefore be non refundable
const HATCH_TRIBUTE = 0.05 * FUNDRAISING_ONE_HUNDRED_PERCENT;
// when should the Hatch open, setting 0 will allow anyone to open the Hatch anytime after deployment
const OPEN_DATE = 0;

// # Impact hours settings

// Impact Hours token address
const IH_TOKEN = "0xdf2c3c8764a92eb43d2eea0a4c2d77c2306b0835";
// Max theoretical collateral token rate per impact hour
const MAX_IH_RATE = BigNumber.from(100).mul(ONE_TOKEN);

// How much will we need to raise to reach 1/2 of the MAX_IH_RATE divided by total IH
const EXPECTED_RAISE_PER_IH = BigNumber.from(0.012 * 1000)
  .mul(ONE_TOKEN)
  .div(1000);

const getParams = (blockTime) => ({
  HOURS,
  DAYS,
  ONE_HUNDRED_PERCENT,
  ONE_TOKEN,
  FUNDRAISING_ONE_HUNDRED_PERCENT,
  FUNDRAISING_ONE_TOKEN,
  PPM,
  COLLATERAL_TOKEN,
  ORG_TOKEN_NAME,
  ORG_TOKEN_SYMBOL,
  SCORE_TOKEN,
  SCORE_ONE_TOKEN,
  HATCH_ORACLE_RATIO,
  TOLLGATE_FEE,
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
  EXPECTED_RAISE_PER_IH,
  SUPPORT_REQUIRED,
  MIN_ACCEPTANCE_QUORUM,
  VOTE_DURATION_BLOCKS: VOTE_DURATION / blockTime,
  VOTE_BUFFER_BLOCKS: VOTE_BUFFER / blockTime,
  VOTE_EXECUTION_DELAY_BLOCKS: VOTE_EXECUTION_DELAY / blockTime,
});

export default getParams;
