import {
  FluidProposals as FluidProposalsContract,
  ProposalActivated,
  ProposalDeactivated,
} from '../../generated/templates/FluidProposals/FluidProposals'
import { getProposalEntity, ZERO_ADDRESS } from '../helpers'
import {
  PROPOSAL_TYPE_SUGGESTION,
  PROPOSAL_TYPE_SUGGESTION_NUM,
  PROPOSAL_TYPE_STREAM,
  PROPOSAL_TYPE_STREAM_NUM,
} from '../types'

export function handleProposalActivated(event: ProposalActivated): void {
  const fluidProposals = FluidProposalsContract.bind(event.address)

  const proposal = getProposalEntity(fluidProposals.cv(), event.params.id)

  proposal.type = PROPOSAL_TYPE_STREAM
  proposal.typeInt = PROPOSAL_TYPE_STREAM_NUM
  proposal.beneficiary = event.params.beneficiary

  proposal.save()
}

export function handleProposalDeactivated(event: ProposalDeactivated): void {
  const fluidProposals = FluidProposalsContract.bind(event.address)

  const proposal = getProposalEntity(fluidProposals.cv(), event.params.id)

  proposal.type = PROPOSAL_TYPE_SUGGESTION
  proposal.typeInt = PROPOSAL_TYPE_SUGGESTION_NUM
  proposal.beneficiary = ZERO_ADDRESS

  proposal.save()
}
