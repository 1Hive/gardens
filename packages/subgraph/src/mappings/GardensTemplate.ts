import {
  DeployDao as DeployDaoEvent,
  SetupDao as SetupDaoEvent,
  DeployToken as DeployTokenEvent,
  InstalledApp as InstalledAppEvent,
  GardenTransactionTwo as GardenTransactionTwoEvent,
} from '../../generated/GardensTemplate/GardensTemplate'
import { Kernel as KernelTemplate } from '../../generated/templates'
import { setUpHoneyLiquidity, loadOrCreateOrg } from '../helpers'

export function handleDeployDao(event: DeployDaoEvent): void {
  const org = loadOrCreateOrg(event.params.dao)
  org.createdAt = event.block.timestamp
  org.active = false
  org.save()

  KernelTemplate.create(event.params.dao)
}

export function handleSetupDao(event: SetupDaoEvent): void {
  const orgAddress = event.params.dao
  const org = loadOrCreateOrg(orgAddress)

  // Set org as active when dao setup finished
  org.active = true
  org.save()

  setUpHoneyLiquidity(event.address, orgAddress)
}

export function handleDeployToken(event: DeployTokenEvent): void {}

export function handleInstalledApp(event: InstalledAppEvent): void {}

export function handleGardenTransactionTwo(event: GardenTransactionTwoEvent): void {
  const dao = loadOrCreateOrg(event.params.dao)

  org.incentivisedPriceOracle = event.params.incentivisedPriceOracle
  org.unipool = event.params.unipool
  org.save()
}
