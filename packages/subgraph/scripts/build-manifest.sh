#!/bin/bash

if [ "$STAGING" ]
then
  FILE=$NETWORK'-staging.json'
else
  FILE=$NETWORK'.json'
fi

DATA=manifest/data/$FILE

HARDHAT_MODULE=$(node -e 'console.log(require("path").dirname(require.resolve("@gardens/hardhat/package.json")))')

echo 'Generating manifest from data file: '$DATA
cat $DATA

mustache \
  -p manifest/templates/sources/Organizations.yaml \
  -p manifest/templates/sources/GardensTemplates.yaml \
  -p manifest/templates/contracts/Agreement.template.yaml \
  -p manifest/templates/contracts/ConvictionVoting.template.yaml \
  -p manifest/templates/contracts/DisputableVoting.template.yaml \
  -p manifest/templates/contracts/Organization.template.yaml \
  -p manifest/templates/contracts/GardensTemplate.template.yaml \
  $DATA \
  subgraph.template.yaml \
  | sed -e "s#\$HARDHAT_MODULE#$HARDHAT_MODULE#g" \
  > subgraph.yaml