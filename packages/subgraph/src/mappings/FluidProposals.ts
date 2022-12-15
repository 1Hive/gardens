import {
  FluidProposals as FluidProposalsContract,
  ProposalRegistered,
} from '../../generated/templates/FluidProposals/FluidProposals'
import { getProposalEntity } from '../helpers'
import { PROPOSAL_TYPE_STREAM, PROPOSAL_TYPE_STREAM_NUM } from '../types'

export function handleProposalRegistered(event: ProposalRegistered): void {
  const fluidProposals = FluidProposalsContract.bind(event.address)

  const proposal = getProposalEntity(fluidProposals.cv(), event.params.id)

  proposal.type = PROPOSAL_TYPE_STREAM
  proposal.typeInt = PROPOSAL_TYPE_STREAM_NUM
  proposal.beneficiary = event.params.beneficiary

  proposal.save()
}
