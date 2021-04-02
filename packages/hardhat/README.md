# Honey Template

Aragon DAO Template for continuous issuance and bottom up fund allocation. Used as the base for Honey, 1Hive's community currency.

## Local deployment

This template depends on a number of yet to be published apps, so to develop locally you must deploy those applications first.

- Conviction Voting (Latest version with hooks)
- Hooked Token Manager (Latest version)
- Dandelion Voting (Latest version with hooks)
- Tollgate
- Issuance

## Rinkeby deployment using previously deployed template

To deploy a Honey Pot DAO to Rinkeby:

1. Install dependencies:

```
$ npm install
```

2. Compile contracts:

```
$ npx truffle compile
```

3. Configure your DAO in: `scripts/new-dao.js`

4. Deploy a DAO to Rinkeby (requires 2 Rinkeby accounts accessible by the truffle script as documented here:
   https://hack.aragon.org/docs/cli-intro#set-a-private-key, add 2 private keys):

```
$ npx truffle exec scripts/new-dao.js --network rinkeby
```

5. Copy the output DAO address into this URL and open it in a web browser:

```
https://rinkeby.aragon.org/#/<DAO address>
```
