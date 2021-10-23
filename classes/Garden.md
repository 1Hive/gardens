[@1hive/connect-gardens](../README.md) / [Exports](../modules.md) / Garden

# Class: Garden

## Table of contents

### Constructors

- [constructor](Garden.md#constructor)

### Properties

- [#address](Garden.md##address)
- [#connector](Garden.md##connector)

### Methods

- [config](Garden.md#config)
- [disconnect](Garden.md#disconnect)
- [onConfig](Garden.md#onconfig)
- [onProposal](Garden.md#onproposal)
- [onProposals](Garden.md#onproposals)
- [onSupporter](Garden.md#onsupporter)
- [proposal](Garden.md#proposal)
- [proposals](Garden.md#proposals)
- [supporter](Garden.md#supporter)

## Constructors

### constructor

• **new Garden**(`connector`, `address`)

Create a new Garden instance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `connector` | `IGardenConnector` | A GardenConnector instance. |
| `address` | `string` | The garden address. |

#### Defined in

[models/Garden.ts:23](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Garden.ts#L23)

## Properties

### #address

• `Private` **#address**: `string`

#### Defined in

[models/Garden.ts:15](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Garden.ts#L15)

___

### #connector

• `Private` **#connector**: `IGardenConnector`

#### Defined in

[models/Garden.ts:16](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Garden.ts#L16)

## Methods

### config

▸ **config**(): `Promise`<[`Config`](Config.md)\>

Fetch the configuration of the garden.

#### Returns

`Promise`<[`Config`](Config.md)\>

A promise that resolves to the configuratio of the garden.

#### Defined in

[models/Garden.ts:39](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Garden.ts#L39)

___

### disconnect

▸ **disconnect**(): `Promise`<`void`\>

Close the connection.

#### Returns

`Promise`<`void`\>

#### Defined in

[models/Garden.ts:31](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Garden.ts#L31)

___

### onConfig

▸ **onConfig**(`callback`): `SubscriptionHandler`

Subscribe to updates in the configuration of the garden.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `callback` | `FunctionCallback` | A function callback to postprocess the result. |

#### Returns

`SubscriptionHandler`

A GraphQL subsription to the configuratio of the garden.

#### Defined in

[models/Garden.ts:48](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Garden.ts#L48)

___

### onProposal

▸ **onProposal**(`params?`, `callback`): `SubscriptionHandler`

Subscribe to updates in a proposal of the garden.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` |  |
| `params.appAddress` | `undefined` \| `string` | The address of the Aragon application that have created the proposals. |
| `params.number` | `undefined` \| `string` | The proposal identification number. |
| `callback` | `FunctionCallback` | A function callback to postprocess the result. |

#### Returns

`SubscriptionHandler`

A GraphQL subsription to a proposal of the garden.

#### Defined in

[models/Garden.ts:72](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Garden.ts#L72)

___

### onProposals

▸ **onProposals**(`__namedParameters?`, `callback`): `SubscriptionHandler`

Subscribe to updates of a list of proposals of the garden.

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |
| `__namedParameters.first` | `undefined` \| `number` |
| `__namedParameters.metadata` | `undefined` \| `string` |
| `__namedParameters.orderBy` | `undefined` \| `string` |
| `__namedParameters.orderDirection` | `undefined` \| `string` |
| `__namedParameters.skip` | `undefined` \| `number` |
| `__namedParameters.statuses` | `undefined` \| `number`[] |
| `__namedParameters.types` | `undefined` \| `number`[] |
| `callback` | `FunctionCallback` |

#### Returns

`SubscriptionHandler`

A GraphQL subsription to a list of proposals of the garden.

#### Defined in

[models/Garden.ts:113](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Garden.ts#L113)

___

### onSupporter

▸ **onSupporter**(`params?`, `callback`): `SubscriptionHandler`

Subscribe to updates in a supporter of the garden.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` |  |
| `params.id` | `undefined` \| `string` | The identifier of the supporter to fetch. |
| `callback` | `FunctionCallback` | A function callback to postprocess the result. |

#### Returns

`SubscriptionHandler`

A GraphQL subsription to a supporter of the garden.

#### Defined in

[models/Garden.ts:156](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Garden.ts#L156)

___

### proposal

▸ **proposal**(`params?`): `Promise`<[`Proposal`](Proposal.md)\>

Fetch a proposal of the garden.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` |  |
| `params.appAddress` | `undefined` \| `string` | The address of the Aragon application that have created the proposals. |
| `params.number` | `undefined` \| `string` | The proposal identification number. |

#### Returns

`Promise`<[`Proposal`](Proposal.md)\>

A promise that resolves to a proposal of the garden.

#### Defined in

[models/Garden.ts:59](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Garden.ts#L59)

___

### proposals

▸ **proposals**(`params?`): `Promise`<[`Proposal`](Proposal.md)[]\>

Fetch a list of proposals of the garden.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | A filters object. |
| `params.first` | `undefined` \| `number` | Number of entities to return. |
| `params.metadata` | `undefined` \| `string` | Filter by proposal name. |
| `params.orderBy` | `undefined` \| `string` | Filter to order the results. |
| `params.orderDirection` | `undefined` \| `string` | Direction to order the results. |
| `params.skip` | `undefined` \| `number` | Number of entities to skip. |
| `params.statuses` | `undefined` \| `number`[] | Filter by proposal status. |
| `params.types` | `undefined` \| `number`[] | Filter by proposal type. |

#### Returns

`Promise`<[`Proposal`](Proposal.md)[]\>

A promise that resolves to a list of proposals of the garden.

#### Defined in

[models/Garden.ts:89](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Garden.ts#L89)

___

### supporter

▸ **supporter**(`params?`): `Promise`<[`Supporter`](Supporter.md)\>

Fetch a supporter of the garden.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` |  |
| `params.id` | `undefined` \| `string` | The identifier of the supporter to fetch. |

#### Returns

`Promise`<[`Supporter`](Supporter.md)\>

A promise that resolves to a supporter of the garden.

#### Defined in

[models/Garden.ts:144](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Garden.ts#L144)
