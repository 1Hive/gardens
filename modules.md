[@1hive/connect-gardens](README.md) / Exports

# @1hive/connect-gardens

## Table of contents

### Other Classes

- [Config](classes/Config.md)
- [Garden](classes/Garden.md)
- [Proposal](classes/Proposal.md)
- [StakeHistory](classes/StakeHistory.md)
- [Supporter](classes/Supporter.md)

### Utility Classes

- [GardenConnector](classes/GardenConnector.md)

### Main Functions

- [connectGarden](modules.md#connectgarden)
- [getGardens](modules.md#getgardens)
- [getUser](modules.md#getuser)

## Main Functions

### connectGarden

▸ **connectGarden**(`organization`, `config?`): [`Garden`](classes/Garden.md)

The default way to connect a Garden and start fetching data from the subgraph.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `organization` | `default` | Organization class we are connecting to using Aragon Connect. |
| `config?` | `Config` | A configuration object. |

#### Returns

[`Garden`](classes/Garden.md)

A new Garden instance.

#### Defined in

[connect.ts:19](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/connect.ts#L19)

___

### getGardens

▸ **getGardens**(`config`, `params`): `Promise`<`Organization`[]\>

Fetch a list of gardens from a subgraph.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | `Config` | A configuration object. |
| `params` | `GardenParams` | A filters object. |

#### Returns

`Promise`<`Organization`[]\>

A promise that resolves to a group of gardens.

#### Defined in

[gardens.ts:43](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/gardens.ts#L43)

___

### getUser

▸ **getUser**(`config`, `params`): `Promise`<`User`[]\>

The default way to connect a garden and start fetching data from the subgraph.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | `Config` | A configuration object. |
| `params` | `UserParams` | A filters object. |

#### Returns

`Promise`<`User`[]\>

A promise that resolves to a group of users.

#### Defined in

[gardens.ts:65](https://github.com/1Hive/gardens/blob/45584cf/packages/connector/src/gardens.ts#L65)
