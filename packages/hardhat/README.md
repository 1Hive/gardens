# Garden Template

Aragon DAO Template for continuous issuance and bottom up fund allocation.

## Localhost deployment

To deploy a Gardens DAO to localhost:

1. Install dependencies

```
$ cd packages/hardhat
$ yarn
```

2. Run a local hardhat blockchain (configured as a fork of xDAI). It deploys the Gardens Template automatically.

```
$ yarn chain
```

3. Configure your DAO in `packages/hardhat/params-boboli.json` or `packages/hardhat/params-veneto.json` depending of the [type of garden](https://1hive.gitbook.io/gardens/garden-creators/garden-modes) you want to deploy.

4. Deploy the DAO:

```
$ yarn new:garden:boboli -- --network localhost
```

## Rinkeby/xDAI deployment

Check our documentation for a detailed guide on how to [create a Garden with scripts.](https://1hive.gitbook.io/gardens/garden-creators/create-a-garden/create-a-garden-with-scripts)
