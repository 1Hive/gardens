import {getProposalEntity} from "./helpers";
import {STATUS_EXECUTED, STATUS_EXECUTED_NUM} from "./statuses";

export function handleDaoCreated(event: DaoCreated): void {
    let proposal = getProposalEntity(event.address, event.params.id)
    proposal.status = STATUS_EXECUTED
    proposal.statusInt = STATUS_EXECUTED_NUM
    proposal.executedAt = event.block.timestamp

    proposal.save()
}