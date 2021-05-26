#!/bin/bash

if [ "$STAGING" ]
then
  FILE=$NETWORK'-staging.json'
else
  FILE=$NETWORK'.json'
fi

DATA=manifest/data/$FILE

echo 'Generating constants from data file: '$DATA
cat $DATA

mustache $DATA src/constants.template.ts > src/constants.ts
