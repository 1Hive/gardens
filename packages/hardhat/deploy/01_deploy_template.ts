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
    Erc721AdapterFactory,
  } = Config.Bases[hre.network.name]

  await deploy('GardensTemplate', {
    from: deployer,
    args: [
      DAOFactory,
      ENS,
      MiniMeFactory,
      AragonID,
      StableToken,
      PriceOracleFactory,
      CollateralRequirementUpdaterFactory,
      UniswapV2Factory,
      Arbitrator,
      StakingFactory,
      Erc721AdapterFactory,
    ],
    log: true,
    deterministicDeployment: true,
  })
}
export default func
