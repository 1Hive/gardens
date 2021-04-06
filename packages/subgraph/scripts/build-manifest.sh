#!/bin/bash
if [ "$NETWORK" ]
then 
  if [ "$STAGING" ]
  then
    FILE=$NETWORK'-staging.json'
  else
    FILE=$NETWORK'.json'
  fi
else  
  FILE='xdai.json'
fi

DATA=manifest/data/$FILE

echo 'Generating manifest from data file: '$DATA
cat $DATA

mustache \
  -p manifest/templates/ConvictionVoting.template.yaml \
  -p manifest/templates/DandelionVoting.template.yaml \
  -p manifest/templates/Organization.template.yaml \
  $DATA \
  subgraph.template.yaml > subgraph.yaml