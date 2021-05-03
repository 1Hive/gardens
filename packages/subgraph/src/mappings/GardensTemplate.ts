import {
  DeployDao as DeployDaoEvent,
  SetupDao as SetupDaoEvent,
  DeployToken as DeployTokenEvent,
  InstalledApp as InstalledAppEvent,
} from '../../generated/GardensTemplate/GardensTemplate'
import { Kernel as KernelTemplate } from '../../generated/templates'
import { loadOrCreateOrg } from '../helpers'

export function handleDeployDao(event: DeployDaoEvent): void {
  const org = loadOrCreateOrg(event.params.dao)
  org.createdAt = event.block.timestamp
  org.save()

  KernelTemplate.create(event.params.dao)
}

export function handleSetupDao(event: SetupDaoEvent): void {
  const org = loadOrCreateOrg(event.params.dao)
  // Set org as active when dao setup finished
  org.active = true
  org.save()
}

export function handleDeployToken(event: DeployTokenEvent): void {}

export function handleInstalledApp(event: InstalledAppEvent): void {}
