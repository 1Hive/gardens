import { NewAppProxy as NewAppProxyEvent } from '../../generated/GardensTemplate/Kernel'
import { processApp, processOrg } from '../processors'

export function handleNewAppProxy(event: NewAppProxyEvent): void {
  processOrg(event.address, event.block.timestamp)
  processApp(event.address, event.params.proxy, event.params.appId.toHexString())
}
