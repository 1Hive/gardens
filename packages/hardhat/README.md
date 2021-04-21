# Honey Template

Aragon DAO Template for continuous issuance and bottom up fund allocation.

## Local deployment

This template depends on a number of yet to be published apps, so to develop locally you must deploy those applications first.

- Conviction Voting (Latest disputable version)
- Hooked Token Manager (Latest version)
- Disputable Voting (Latest version with hooks)
- Agreements
- Issuance

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

4. Deploy the DAO:

```
$ cd packages/hardhat
$ npx hardhat run scripts/new-dao.ts --network localhost
```

## Rinkeby/xDAI deployment

To deploy a Gardens DAO to Rinkeby/xDAI:

1. Install dependencies:

```
$ yarn
```

2. Configure your DAO in `packages/hardhat/params-rinkeby.json` or `packages/hardhat/params-xdai.json`, depending on the network you want to deploy it.

3. If you are deploying on Rinkeby, modify the GardensTemplate.sol so it inherits from AppIdsRinkeby.sol instead of AppIdsXDai.sol.

4. Deploy the DAO:

```
$ cd packages/hardhat
$ npx hardhat run scripts/new-dao.ts --network rinkeby # or --network xdai
```

5. Copy the output DAO address into this URL and open it in a web browser:

```
https://rinkeby.aragon.org/#/<DAO address>
```
