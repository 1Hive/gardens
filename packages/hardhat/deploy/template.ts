import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

import { Config } from "../helpers/configuration";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  const { AragonID, DAOFactory, ENS, MiniMeFactory } = Config.Bases[hre.network.name];

  await deploy("HoneyPotTemplate", {
    from: deployer,
    args: [DAOFactory, ENS, MiniMeFactory, AragonID],
    log: true,
    deterministicDeployment: true,
  });
};
export default func;
