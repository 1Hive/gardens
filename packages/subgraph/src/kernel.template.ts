import { Address, DataSourceTemplate } from '@graphprotocol/graph-ts'
import { NewAppProxy as NewAppProxyEvent } from '../generated/Kernel/Kernel'
import { loadConvictionConfig } from './helpers'

const AGREEMENT_APPIDS: [String] = [{{#agreementAppIds}}'{{id}}',{{/agreementAppIds}}]
const CONVICTION_VOTING_APPIDS: [String] = [{{#convictionVotingAppIds}}'{{id}}',{{/convictionVotingAppIds}}]
const VOTING_APPIDS: [String] = [{{#votingAppIds}}'{{id}}',{{/votingAppIds}}]

function onAppTemplateCreated(
  orgAddress: Address,
  appAddress: Address,
  appId: string
): void {
  if (CONVICTION_VOTING_APPIDS.includes(appId)) {
    loadConvictionConfig(orgAddress, appAddress)
  }
}

function processApp(
  orgAddress: Address,
  appAddress: Address,
  appId: string
): void {
  let template: string

  if (VOTING_APPIDS.includes(appId)) {
    template = 'DisputableVoting'
  } else if (CONVICTION_VOTING_APPIDS.includes(appId)) {
    template = 'ConvictionVoting'
  } else if (AGREEMENT_APPIDS.includes(appId)) {
    template = 'Agreement'
  }

  if (template) {
    DataSourceTemplate.create(template, [appAddress.toHexString()])
    onAppTemplateCreated(orgAddress, appAddress, appId)
  }
}

export function handleNewAppProxy(event: NewAppProxyEvent): void {
  processApp(
    event.address,
    event.params.proxy,
    event.params.appId.toHexString()
  )
}
