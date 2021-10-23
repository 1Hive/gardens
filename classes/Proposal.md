[@1hive/connect-gardens](../README.md) / [Exports](../modules.md) / Proposal

# Class: Proposal

## Table of contents

### Constructors

- [constructor](Proposal.md#constructor)

### Properties

- [#connector](Proposal.md##connector)
- [actionId](Proposal.md#actionid)
- [beneficiary](Proposal.md#beneficiary)
- [casts](Proposal.md#casts)
- [challengeEndDate](Proposal.md#challengeenddate)
- [challengeId](Proposal.md#challengeid)
- [challenger](Proposal.md#challenger)
- [challengerArbitratorFeeId](Proposal.md#challengerarbitratorfeeid)
- [createdAt](Proposal.md#createdat)
- [creator](Proposal.md#creator)
- [disputeId](Proposal.md#disputeid)
- [disputedAt](Proposal.md#disputedat)
- [executedAt](Proposal.md#executedat)
- [id](Proposal.md#id)
- [isAccepted](Proposal.md#isaccepted)
- [link](Proposal.md#link)
- [metadata](Proposal.md#metadata)
- [nays](Proposal.md#nays)
- [number](Proposal.md#number)
- [organization](Proposal.md#organization)
- [pauseDuration](Proposal.md#pauseduration)
- [pausedAt](Proposal.md#pausedat)
- [quietEndingExtensionDuration](Proposal.md#quietendingextensionduration)
- [quietEndingSnapshotSupport](Proposal.md#quietendingsnapshotsupport)
- [requestedAmount](Proposal.md#requestedamount)
- [script](Proposal.md#script)
- [setting](Proposal.md#setting)
- [settledAt](Proposal.md#settledat)
- [settlementOffer](Proposal.md#settlementoffer)
- [snapshotBlock](Proposal.md#snapshotblock)
- [stable](Proposal.md#stable)
- [stakes](Proposal.md#stakes)
- [stakesHistory](Proposal.md#stakeshistory)
- [startDate](Proposal.md#startdate)
- [status](Proposal.md#status)
- [submitterArbitratorFeeId](Proposal.md#submitterarbitratorfeeid)
- [totalPower](Proposal.md#totalpower)
- [totalTokensStaked](Proposal.md#totaltokensstaked)
- [type](Proposal.md#type)
- [yeas](Proposal.md#yeas)

### Methods

- [challengerArbitratorFee](Proposal.md#challengerarbitratorfee)
- [collateralRequirement](Proposal.md#collateralrequirement)
- [disconnect](Proposal.md#disconnect)
- [onChallengerArbitratorFee](Proposal.md#onchallengerarbitratorfee)
- [onCollateralRequirement](Proposal.md#oncollateralrequirement)
- [onSubmitterArbitratorFee](Proposal.md#onsubmitterarbitratorfee)
- [submitterArbitratorFee](Proposal.md#submitterarbitratorfee)

## Constructors

### constructor

• **new Proposal**(`data`, `connector`)

Create a new Proposal instance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `ProposalData` | The proposal data. |
| `connector` | `IGardenConnector` | A GardenConnector instance. |

#### Defined in

[models/Proposal.ts:71](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Proposal.ts#L71)

## Properties

### #connector

• `Private` **#connector**: `IGardenConnector`

#### Defined in

[models/Proposal.ts:18](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Proposal.ts#L18)

___

### actionId

• `Optional` `Readonly` **actionId**: `string`

#### Defined in

[models/Proposal.ts:53](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Proposal.ts#L53)

___

### beneficiary

• `Optional` `Readonly` **beneficiary**: `string`

#### Defined in

[models/Proposal.ts:34](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Proposal.ts#L34)

___

### casts

• `Optional` `Readonly` **casts**: `CastData`[]

#### Defined in

[models/Proposal.ts:50](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Proposal.ts#L50)

___

### challengeEndDate

• `Optional` `Readonly` **challengeEndDate**: `string`

#### Defined in

[models/Proposal.ts:56](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Proposal.ts#L56)

___

### challengeId

• `Optional` `Readonly` **challengeId**: `string`

#### Defined in

[models/Proposal.ts:54](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Proposal.ts#L54)

___

### challenger

• `Optional` `Readonly` **challenger**: `string`

#### Defined in

[models/Proposal.ts:55](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Proposal.ts#L55)

___

### challengerArbitratorFeeId

• `Optional` `Readonly` **challengerArbitratorFeeId**: `string`

#### Defined in

[models/Proposal.ts:64](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Proposal.ts#L64)

___

### createdAt

• `Readonly` **createdAt**: `string`

#### Defined in

[models/Proposal.ts:26](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Proposal.ts#L26)

___

### creator

• `Readonly` **creator**: `string`

#### Defined in

[models/Proposal.ts:23](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Proposal.ts#L23)

___

### disputeId

• `Optional` `Readonly` **disputeId**: `string`

#### Defined in

[models/Proposal.ts:57](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Proposal.ts#L57)

___

### disputedAt

• `Optional` `Readonly` **disputedAt**: `string`

#### Defined in

[models/Proposal.ts:60](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Proposal.ts#L60)

___

### executedAt

• `Readonly` **executedAt**: `string`

#### Defined in

[models/Proposal.ts:27](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Proposal.ts#L27)

___

### id

• `Readonly` **id**: `string`

#### Defined in

[models/Proposal.ts:20](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Proposal.ts#L20)

___

### isAccepted

• `Optional` `Readonly` **isAccepted**: `boolean`

#### Defined in

[models/Proposal.ts:49](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Proposal.ts#L49)

___

### link

• `Optional` `Readonly` **link**: `string`

#### Defined in

[models/Proposal.ts:31](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Proposal.ts#L31)

___

### metadata

• `Optional` `Readonly` **metadata**: `string`

#### Defined in

[models/Proposal.ts:28](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Proposal.ts#L28)

___

### nays

• `Optional` `Readonly` **nays**: `string`

#### Defined in

[models/Proposal.ts:45](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Proposal.ts#L45)

___

### number

• `Readonly` **number**: `string`

#### Defined in

[models/Proposal.ts:22](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Proposal.ts#L22)

___

### organization

• `Readonly` **organization**: `OrganizationData`

#### Defined in

[models/Proposal.ts:21](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Proposal.ts#L21)

___

### pauseDuration

• `Optional` `Readonly` **pauseDuration**: `string`

#### Defined in

[models/Proposal.ts:62](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Proposal.ts#L62)

___

### pausedAt

• `Optional` `Readonly` **pausedAt**: `string`

#### Defined in

[models/Proposal.ts:61](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Proposal.ts#L61)

___

### quietEndingExtensionDuration

• `Optional` `Readonly` **quietEndingExtensionDuration**: `string`

#### Defined in

[models/Proposal.ts:46](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Proposal.ts#L46)

___

### quietEndingSnapshotSupport

• `Optional` `Readonly` **quietEndingSnapshotSupport**: `string`

#### Defined in

[models/Proposal.ts:47](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Proposal.ts#L47)

___

### requestedAmount

• `Optional` `Readonly` **requestedAmount**: `string`

#### Defined in

[models/Proposal.ts:35](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Proposal.ts#L35)

___

### script

• `Optional` `Readonly` **script**: `string`

#### Defined in

[models/Proposal.ts:48](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Proposal.ts#L48)

___

### setting

• `Optional` `Readonly` **setting**: `VotingConfigData`

#### Defined in

[models/Proposal.ts:40](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Proposal.ts#L40)

___

### settledAt

• `Optional` `Readonly` **settledAt**: `string`

#### Defined in

[models/Proposal.ts:58](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Proposal.ts#L58)

___

### settlementOffer

• `Optional` `Readonly` **settlementOffer**: `string`

#### Defined in

[models/Proposal.ts:59](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Proposal.ts#L59)

___

### snapshotBlock

• `Optional` `Readonly` **snapshotBlock**: `string`

#### Defined in

[models/Proposal.ts:43](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Proposal.ts#L43)

___

### stable

• `Optional` `Readonly` **stable**: `boolean`

#### Defined in

[models/Proposal.ts:37](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Proposal.ts#L37)

___

### stakes

• `Optional` `Readonly` **stakes**: `StakeData`[]

#### Defined in

[models/Proposal.ts:32](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Proposal.ts#L32)

___

### stakesHistory

• `Optional` `Readonly` **stakesHistory**: `StakeHistoryData`[]

#### Defined in

[models/Proposal.ts:33](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Proposal.ts#L33)

___

### startDate

• `Optional` `Readonly` **startDate**: `string`

#### Defined in

[models/Proposal.ts:41](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Proposal.ts#L41)

___

### status

• `Readonly` **status**: `string`

#### Defined in

[models/Proposal.ts:24](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Proposal.ts#L24)

___

### submitterArbitratorFeeId

• `Optional` `Readonly` **submitterArbitratorFeeId**: `string`

#### Defined in

[models/Proposal.ts:63](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Proposal.ts#L63)

___

### totalPower

• `Optional` `Readonly` **totalPower**: `string`

#### Defined in

[models/Proposal.ts:42](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Proposal.ts#L42)

___

### totalTokensStaked

• `Optional` `Readonly` **totalTokensStaked**: `string`

#### Defined in

[models/Proposal.ts:36](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Proposal.ts#L36)

___

### type

• `Readonly` **type**: `string`

#### Defined in

[models/Proposal.ts:25](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Proposal.ts#L25)

___

### yeas

• `Optional` `Readonly` **yeas**: `string`

#### Defined in

[models/Proposal.ts:44](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Proposal.ts#L44)

## Methods

### challengerArbitratorFee

▸ **challengerArbitratorFee**(): `Promise`<``null`` \| `default`\>

Fetch the arbitrator fee for the challenger of the proposal.

#### Returns

`Promise`<``null`` \| `default`\>

A promise that resolves to the arbitrator fee for the challenger of the proposal.

#### Defined in

[models/Proposal.ts:170](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Proposal.ts#L170)

___

### collateralRequirement

▸ **collateralRequirement**(): `Promise`<`default`\>

Fetch the collateral requirement of the proposal.

#### Returns

`Promise`<`default`\>

A promise that resolves to the collateral requirement of the proposal.

#### Defined in

[models/Proposal.ts:132](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Proposal.ts#L132)

___

### disconnect

▸ **disconnect**(): `Promise`<`void`\>

Close the connection.

#### Returns

`Promise`<`void`\>

#### Defined in

[models/Proposal.ts:124](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Proposal.ts#L124)

___

### onChallengerArbitratorFee

▸ **onChallengerArbitratorFee**(`callback?`): `SubscriptionHandler`

Subscribe to updates in the arbitrator fee for the challenger of the proposal.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `callback?` | `FunctionCallback` | A function callback to postprocess the result. |

#### Returns

`SubscriptionHandler`

A GraphQL subsription to the arbitrator fee for the challenger of the proposal.

#### Defined in

[models/Proposal.ts:179](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Proposal.ts#L179)

___

### onCollateralRequirement

▸ **onCollateralRequirement**(`callback?`): `SubscriptionHandler`

Subscribe to updates in the collateral requirement of the proposal.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `callback?` | `FunctionCallback` | A function callback to postprocess the result. |

#### Returns

`SubscriptionHandler`

A GraphQL subsription to the collateral requirement of the proposal.

#### Defined in

[models/Proposal.ts:141](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Proposal.ts#L141)

___

### onSubmitterArbitratorFee

▸ **onSubmitterArbitratorFee**(`callback?`): `SubscriptionHandler`

Subscribe to updates in the arbitrator fee for the submitter of the proposal.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `callback?` | `FunctionCallback` | A function callback to postprocess the result. |

#### Returns

`SubscriptionHandler`

A GraphQL subsription to the arbitrator fee for the submitter of the proposal.

#### Defined in

[models/Proposal.ts:160](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Proposal.ts#L160)

___

### submitterArbitratorFee

▸ **submitterArbitratorFee**(): `Promise`<``null`` \| `default`\>

Fetch the arbitrator fee for the submitter of the proposal.

#### Returns

`Promise`<``null`` \| `default`\>

A promise that resolves to the arbitrator fee for the submitter of the proposal.

#### Defined in

[models/Proposal.ts:151](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/models/Proposal.ts#L151)
