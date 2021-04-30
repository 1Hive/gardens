import {
  DeployDao as DeployDaoEvent,
  SetupDao as SetupDaoEvent,
  DeployToken as DeployTokenEvent,
  InstalledApp as InstalledAppEvent,
} from '../../generated/GardensTemplate/GardensTemplate'
import { Kernel as KernelTemplate } from '../../generated/templates'
import { loadOrCreateOrg } from '../helpers'

export function handleDeployDao(event: DeployDaoEvent): void {
  let org = loadOrCreateOrg(event.params.dao)
  org.createdAt = event.block.timestamp
  org.save()

  KernelTemplate.create(event.params.dao)
}

export function handleSetupDao(event: SetupDaoEvent): void {}

export function handleDeployToken(event: DeployTokenEvent): void {}

export function handleInstalledApp(event: InstalledAppEvent): void {}
