import {
    DaoCreated as DaoCreatedEvent
} from '../generated/templates/Organization/Organization'

import {
    Organization as OrganizationEntity,
} from '../../generated/schema'

export function handleDaoCreated(event: DaoCreatedEvent): void {
    let id = event.params.address.toHexString()
    let organization = OrganizationEntity.load(id)

    if(!organization) {
        organization = new OrganizationEntity(id)
        organization.createdAt = event.block.timestamp
        organization.save()
    }
    return

}