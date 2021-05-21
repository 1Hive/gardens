import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'

import { Config } from '../helpers/configuration'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  const {
    AragonID,
    DAOFactory,
    ENS,
    MiniMeFactory,
    HoneyswapRouter,
    HoneyToken,
    StableToken,
    HoneyPriceOracle,
    PriceOracleFactory,
    CollateralRequirementUpdaterFactory,
    UniswapV2Factory,
    UnipoolFactory,
    Arbitrator,
    StakingFactory,
  } = Config.Bases[process.env.HARDHAT_FORK]

  await deploy('GardensTemplate', {
    from: deployer,
    args: [
      DAOFactory,
      ENS,
      MiniMeFactory,
      AragonID,
      HoneyswapRouter,
      HoneyToken,
      StableToken,
      HoneyPriceOracle,
      PriceOracleFactory,
      CollateralRequirementUpdaterFactory,
      UniswapV2Factory,
      UnipoolFactory,
      Arbitrator,
      StakingFactory,
    ],
    log: true,
    deterministicDeployment: true,
  })
}
export default func
