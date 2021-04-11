import {
    Organization,
    OrganizationCreated as OrganizationCreatedEvent
} from '../generated/templates/Organization/Organization'

import {
    Organization as OrganizationEntity,
} from '../../generated/schema'

export function handleOrganizationCreated(event: OrganizationCreatedEvent): void {
    let id = event.params.address.toHexString()
    let organization = OrganizationEntity.load(id)

    if(!organization) {
        organization = new OrganizationEntity(id)
        organization.createdAt = event.block.timestamp
        organization.save()
    }

    Organization.create(event.params.address)
}