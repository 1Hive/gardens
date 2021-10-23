[@1hive/connect-gardens](../README.md) / [Exports](../modules.md) / GardenConnector

# Class: GardenConnector

Connector that expose functionalities to fetch garden data from subgraphs.

## Implements

- `IGardenConnector`

## Table of contents

### Constructors

- [constructor](GardenConnector.md#constructor)

### Properties

- [#gql](GardenConnector.md##gql)

### Methods

- [arbitratorFee](GardenConnector.md#arbitratorfee)
- [collateralRequirement](GardenConnector.md#collateralrequirement)
- [config](GardenConnector.md#config)
- [disconnect](GardenConnector.md#disconnect)
- [onArbitratorFee](GardenConnector.md#onarbitratorfee)
- [onCollateralRequirement](GardenConnector.md#oncollateralrequirement)
- [onConfig](GardenConnector.md#onconfig)
- [onProposal](GardenConnector.md#onproposal)
- [onProposals](GardenConnector.md#onproposals)
- [onSupporter](GardenConnector.md#onsupporter)
- [proposal](GardenConnector.md#proposal)
- [proposals](GardenConnector.md#proposals)
- [supporter](GardenConnector.md#supporter)

## Constructors

### constructor

• **new GardenConnector**(`config`)

Create a new GardenConnector instance.z

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | `GardenConnectorConfig` | The connector configuration object. |

#### Defined in

[thegraph/connector.ts:60](https://github.com/1Hive/gardens/blob/7e512ca/packages/connector/src/thegraph/connector.ts#L60)

## Properties

### #gql

• `Private` **#gql**: `default`

#### Defined in

[thegraph/connector.ts:54](https://github.com/1Hive/gardens/blob/7e512ca/packages/connector/src/thegraph/connector.ts#L54)

## Methods

### arbitratorFee

▸ **arbitratorFee**(`arbitratorFeeId`): `Promise`<``null`` \| `default`\>

Fetch the arbitrator fee of a proposal of the garden.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `arbitratorFeeId` | `string` | The identifier of the arbitrator fee. |

#### Returns

`Promise`<``null`` \| `default`\>

A promise that resolves to the arbitrator fee of a proposal.

#### Implementation of

IGardenConnector.arbitratorFee

#### Defined in

[thegraph/connector.ts:266](https://github.com/1Hive/gardens/blob/7e512ca/packages/connector/src/thegraph/connector.ts#L266)

___

### collateralRequirement

▸ **collateralRequirement**(`proposalId`): `Promise`<`default`\>

Fetch the collateral requirement of a proposal of the garden.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `proposalId` | `string` | The identifier of the proposal. |

#### Returns

`Promise`<`default`\>

A promise that resolves to the collateral requirement of a proposal.

#### Implementation of

IGardenConnector.collateralRequirement

#### Defined in

[thegraph/connector.ts:238](https://github.com/1Hive/gardens/blob/7e512ca/packages/connector/src/thegraph/connector.ts#L238)

___

### config

▸ **config**(`address`): `Promise`<[`Config`](Config.md)\>

Fetch the configuration of the garden.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `string` | The address of the garden to fetch. |

#### Returns

`Promise`<[`Config`](Config.md)\>

A promise that resolves to the configuratio of the garden.

#### Implementation of

IGardenConnector.config

#### Defined in

[thegraph/connector.ts:82](https://github.com/1Hive/gardens/blob/7e512ca/packages/connector/src/thegraph/connector.ts#L82)

___

### disconnect

▸ **disconnect**(): `Promise`<`void`\>

Close the connection.

#### Returns

`Promise`<`void`\>

#### Implementation of

IGardenConnector.disconnect

#### Defined in

[thegraph/connector.ts:73](https://github.com/1Hive/gardens/blob/7e512ca/packages/connector/src/thegraph/connector.ts#L73)

___

### onArbitratorFee

▸ **onArbitratorFee**(`arbitratorFeeId`, `callback`): `SubscriptionHandler`

Subscribe to updates in the arbitrator fee of a proposal of the garden.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `arbitratorFeeId` | `string` | The identifier of the arbitrator fee. |
| `callback` | `FunctionCallback` | A function callback to postprocess the result. |

#### Returns

`SubscriptionHandler`

A GraphQL subsription to the arbitrator fee of a proposal.

#### Implementation of

IGardenConnector.onArbitratorFee

#### Defined in

[thegraph/connector.ts:280](https://github.com/1Hive/gardens/blob/7e512ca/packages/connector/src/thegraph/connector.ts#L280)

___

### onCollateralRequirement

▸ **onCollateralRequirement**(`proposalId`, `callback`): `SubscriptionHandler`

Subscribe to updates in the collateral requirement of a proposal of the garden.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `proposalId` | `string` | The identifier of the proposal. |
| `callback` | `FunctionCallback` | A function callback to postprocess the result. |

#### Returns

`SubscriptionHandler`

A GraphQL subsription to the collateral requirement of a proposal.

#### Implementation of

IGardenConnector.onCollateralRequirement

#### Defined in

[thegraph/connector.ts:252](https://github.com/1Hive/gardens/blob/7e512ca/packages/connector/src/thegraph/connector.ts#L252)

___

### onConfig

▸ **onConfig**(`address`, `callback`): `SubscriptionHandler`

Subscribe to updates in the configuration of the garden.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `string` | The address of the garden to subscribe. |
| `callback` | `FunctionCallback` | A function callback to postprocess the result. |

#### Returns

`SubscriptionHandler`

A GraphQL subsription to the configuratio of the garden.

#### Implementation of

IGardenConnector.onConfig

#### Defined in

[thegraph/connector.ts:94](https://github.com/1Hive/gardens/blob/7e512ca/packages/connector/src/thegraph/connector.ts#L94)

___

### onProposal

▸ **onProposal**(`id`, `callback`): `SubscriptionHandler`

Subscribe to updates in a proposal of the garden.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | The identifier of the proposal to subscribe. |
| `callback` | `FunctionCallback` | A function callback to postprocess the result. |

#### Returns

`SubscriptionHandler`

A GraphQL subsription to a proposal of the garden.

#### Implementation of

IGardenConnector.onProposal

#### Defined in

[thegraph/connector.ts:120](https://github.com/1Hive/gardens/blob/7e512ca/packages/connector/src/thegraph/connector.ts#L120)

___

### onProposals

▸ **onProposals**(`garden`, `first`, `skip`, `orderBy`, `orderDirection`, `types`, `statuses`, `metadata`, `callback`): `SubscriptionHandler`

Subscribe to updates of a list of proposals of the garden.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `garden` | `string` | The address of the garden to subscribe. |
| `first` | `number` | Number of entities to return. |
| `skip` | `number` | Number of entities to skip. |
| `orderBy` | `string` | Filter to order the results. |
| `orderDirection` | `string` | Direction to order the results. |
| `types` | `number`[] | Filter by proposal types. |
| `statuses` | `number`[] | Filter by proposal statuses. |
| `metadata` | `string` | Filter by proposal name. |
| `callback` | `FunctionCallback` | - |

#### Returns

`SubscriptionHandler`

A GraphQL subsription to a list of proposals of the garden.

#### Implementation of

IGardenConnector.onProposals

#### Defined in

[thegraph/connector.ts:179](https://github.com/1Hive/gardens/blob/7e512ca/packages/connector/src/thegraph/connector.ts#L179)

___

### onSupporter

▸ **onSupporter**(`id`, `callback`): `SubscriptionHandler`

Subscribe to updates in a supporter of the garden.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | The identifier of the supporter to fetch. |
| `callback` | `FunctionCallback` | A function callback to postprocess the result. |

#### Returns

`SubscriptionHandler`

A GraphQL subsription to a supporter of the garden.

#### Implementation of

IGardenConnector.onSupporter

#### Defined in

[thegraph/connector.ts:224](https://github.com/1Hive/gardens/blob/7e512ca/packages/connector/src/thegraph/connector.ts#L224)

___

### proposal

▸ **proposal**(`id`): `Promise`<[`Proposal`](Proposal.md)\>

Fetch a proposal of the garden.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | The identifier of the proposal to fetch. |

#### Returns

`Promise`<[`Proposal`](Proposal.md)\>

A promise that resolves to a proposal of the garden.

#### Implementation of

IGardenConnector.proposal

#### Defined in

[thegraph/connector.ts:108](https://github.com/1Hive/gardens/blob/7e512ca/packages/connector/src/thegraph/connector.ts#L108)

___

### proposals

▸ **proposals**(`garden`, `first`, `skip`, `orderBy`, `orderDirection`, `types`, `statuses`, `metadata`): `Promise`<[`Proposal`](Proposal.md)[]\>

Fetch a list of proposals of the garden.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `garden` | `string` | The address of the garden to fetch. |
| `first` | `number` | Number of entities to return. |
| `skip` | `number` | Number of entities to skip. |
| `orderBy` | `string` | Filter to order the results. |
| `orderDirection` | `string` | Direction to order the results. |
| `types` | `number`[] | Filter by proposal type. |
| `statuses` | `number`[] | Filter by proposal status. |
| `metadata` | `string` | Filter by proposal name. |

#### Returns

`Promise`<[`Proposal`](Proposal.md)[]\>

A promise that resolves to a list of proposals of the garden.

#### Implementation of

IGardenConnector.proposals

#### Defined in

[thegraph/connector.ts:141](https://github.com/1Hive/gardens/blob/7e512ca/packages/connector/src/thegraph/connector.ts#L141)

___

### supporter

▸ **supporter**(`id`): `Promise`<[`Supporter`](Supporter.md)\>

Fetch a supporter of the garden.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | The identifier of the supporter to fetch. |

#### Returns

`Promise`<[`Supporter`](Supporter.md)\>

A promise that resolves to a supporter of the garden.

#### Implementation of

IGardenConnector.supporter

#### Defined in

[thegraph/connector.ts:212](https://github.com/1Hive/gardens/blob/7e512ca/packages/connector/src/thegraph/connector.ts#L212)
