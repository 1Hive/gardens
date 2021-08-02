# Honey Template

Aragon DAO Template for continuous issuance and bottom up fund allocation.

## Localhost deployment

To deploy a Gardens DAO to localhost:

1. Install dependencies

```
$ yarn
```

2. Run a local hardhat blockchain (configured as a fork of xDAI). It deploys the Gardens Template automatically.

```
$ yarn run node
```

3. Configure your DAO in `packages/hardhat/params-xdai.json`.
   Note that if you specify an `existingToken` then the template will deploy in byot (bring your own token) mode.
   Set this to `0x0000000000000000000000000000000000000000` to create a new token with Issuance and an option to airdrop.

4. Deploy the DAO:

```
$ cd packages/hardhat
$ yarn newdao -- --network localhost
```

## Rinkeby/xDAI deployment

To deploy a Gardens DAO to Rinkeby/xDAI:

1. Install dependencies:

```
$ yarn
```

2. Configure your DAO in `packages/hardhat/params-rinkeby.json` or `packages/hardhat/params-xdai.json`, depending on the network you want to deploy it.
   Note that if you specify an `existingToken` then the template will deploy in byot (bring your own token) mode.
   Set this to `0x0000000000000000000000000000000000000000` to create a new token with Issuance and an option to airdrop.

3. If you are deploying on Rinkeby, modify the GardensTemplate.sol so it inherits from AppIdsRinkeby.sol instead of AppIdsXDai.sol.

4. Deploy the DAO:

```
$ cd packages/hardhat
$ yarn newdao -- --network rinkeby # or --network xdai
```

5. Copy the output DAO address into this URL and open it in a web browser:

```
https://rinkeby.aragon.org/#/<DAO address>
```


## SCRIPTS

Here is the list of npm scripts you can execute:

Some of them relies on [./scripts.js](./scripts.js) to allow parameterizing it via command line argument (have a look inside if you need modifications)
<br/><br/>

`yarn compile`

These will compile your contracts
<br/><br/>

`yarn void:deploy`

This will deploy your contracts on the in-memory hardhat network and exit, leaving no trace. quick way to ensure deployments work as intended without consequences
<br/><br/>

`yarn test [mocha args...]`

These will execute your tests using mocha. you can pass extra arguments to mocha
<br/><br/>

`yarn coverage`

These will produce a coverage report in the `coverage/` folder
<br/><br/>

`yarn test:gas`

These will produce a gas report for function used in the tests
<br/><br/>

`yarn dev`

These will run a local hardhat network on `localhost:8545` and deploy your contracts on it. Plus it will watch for any changes and redeploy them.
<br/><br/>

`yarn execute <network> <file.ts> [args...]`

This will execute the script `<file.ts>` against the specified network
<br/><br/>

`yarn deploy <network> [args...]`

This will deploy the contract on the specified network.

Behind the scene it uses `hardhat deploy` command so you can append any argument for it
<br/><br/>

`yarn export <network> <file.json>`

This will export the abi+address of deployed contract to `<file.json>`
<br/><br/>

`yarn fork:execute <network> [--blockNumber <blockNumber>] [--deploy] <file.ts> [args...]`

This will execute the script `<file.ts>` against a temporary fork of the specified network

if `--deploy` is used, deploy scripts will be executed
<br/><br/>

`yarn fork:deploy <network> [--blockNumber <blockNumber>] [args...]`

This will deploy the contract against a temporary fork of the specified network.

Behind the scene it uses `hardhat deploy` command so you can append any argument for it
<br/><br/>

`yarn fork:test <network> [--blockNumber <blockNumber>] [mocha args...]`

This will test the contract against a temporary fork of the specified network.
<br/><br/>

`yarn fork:dev <network> [--blockNumber <blockNumber>] [args...]`

This will deploy the contract against a fork of the specified network and it will keep running as a node.

Behind the scene it uses `hardhat node` command so you can append any argument for it
