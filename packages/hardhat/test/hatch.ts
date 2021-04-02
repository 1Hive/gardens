import { deployments, ethers } from "hardhat";
import { use, assert } from "chai";
import { claimRewards, log } from "./helpers/helpers";
import { solidity } from "ethereum-waffle";
import { assertBn } from "@aragon/contract-helpers-test/src/asserts";

import { default as newHatch, HatchContext } from "../scripts/new-hatch";
import { BigNumber } from "@ethersproject/bignumber";
import { getStateByKey, STATE_CLOSED, STATE_FUNDING, STATE_GOAL_REACHED } from "./helpers/hatch-states";
import { HATCH_ERRORS, IMPACT_HOURS_ERRORS, TOKEN_ERRORS } from "./helpers/errors";
import { calculateRewards } from "./helpers/helpers";

use(solidity);

const MIN_NEGLIGIBLE_AMOUNT = ethers.BigNumber.from(String("10000000"));

describe("Hatch Flow", () => {
  let hatchContext: HatchContext;

  before(async () => {
    hatchContext = await newHatch(log);
  });

  context("When max goal is reached", async () => {
    it("opens the hatch", async function () {
      const tx = await hatchContext.hatch.open();

      await tx.wait();

      assert.strictEqual(
        getStateByKey(await hatchContext.hatch.state()),
        STATE_FUNDING,
        HATCH_ERRORS.ERROR_HATCH_NOT_OPENED
      );
    });

    it("contributes with a max goal amount to the hatch", async () => {
      let tx;
      const maxGoalContribution = await hatchContext.hatch.maxGoal();

      tx = await hatchContext.contributionToken.approve(hatchContext.hatch.address, maxGoalContribution);

      await tx.wait();

      assertBn(
        await hatchContext.contributionToken.allowance(
          await hatchContext.hatchUser.getAddress(),
          hatchContext.hatch.address
        ),
        maxGoalContribution,
        TOKEN_ERRORS.ERROR_APPROVAL_MISMATCH
      );

      tx = await hatchContext.hatch.contribute(maxGoalContribution);

      await tx.wait();

      assertBn(
        await hatchContext.contributionToken.balanceOf(hatchContext.hatch.address),
        maxGoalContribution,
        HATCH_ERRORS.ERROR_CONTRIBUTION_NOT_MADE
      );

      assert.equal(
        getStateByKey(await hatchContext.hatch.state()),
        STATE_GOAL_REACHED,
        HATCH_ERRORS.ERROR_HATCH_GOAL_NOT_REACHED
      );
    });

    it("claims the impact hours for all contributors", async () => {
      const totalRaised = await hatchContext.hatch.totalRaised();
      const totalIH = await hatchContext.impactHoursClonedToken.totalSupply();
      const totalIHRewards = await calculateRewards(hatchContext.impactHours, totalRaised, totalIH);
      const expectedHatchTokens = await hatchContext.hatch.contributionToTokens(totalIHRewards);
      const hatchTokenTotalSupply = await hatchContext.hatchToken.totalSupply();

      await claimRewards(hatchContext.impactHours, hatchContext.impactHoursToken);

      assert.isTrue(
        hatchTokenTotalSupply
          .add(expectedHatchTokens)
          .sub(await hatchContext.hatchToken.totalSupply())
          .lt(MIN_NEGLIGIBLE_AMOUNT),
        IMPACT_HOURS_ERRORS.ERROR_CLAIMED_REWARDS_MISMATCH
      );

      assertBn(
        await hatchContext.impactHoursClonedToken.totalSupply(),
        BigNumber.from(0),
        IMPACT_HOURS_ERRORS.ERROR_ALL_TOKENS_NOT_DESTROYED
      );
    });

    it("closes the hatch", async () => {
      const tx = await hatchContext.impactHours.closeHatch();

      await tx.wait();

      assert.equal(getStateByKey(await hatchContext.hatch.state()), STATE_CLOSED, HATCH_ERRORS.ERROR_HATCH_NOT_CLOSED);
    });
  });

  // context("When none goal is reached", async () => {

  //   it('closes the hatch when funding period is over', async () =>{
  //     let tx

  //   })
  // }
});
