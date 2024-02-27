#!/usr/bin/env bash

# Exit script as soon as a command fails.
set -o errexit

# Run graph build
yarn build

GRAPH_NODE="https://api.thegraph.com/deploy/"
IPFS_NODE="https://api.thegraph.com/ipfs/"

# Keep compatibility with subgraph name on the hosted service
if [[ "$NETWORK" == "gnosis" && ! -n "$STUDIO" ]]; then
  NETWORK="xdai"
fi

# Use custom subgraph name based on target network
if [[ "$NETWORK" != "arbitrum" ]]; then
  SUBGRAPH_EXT="-${NETWORK}"
else
  SUBGRAPH_EXT=""
fi

if [ "$STAGING" ]
then
  SUBGRAPH_EXT='-'$NETWORK'-staging'
fi

echo Deploying subgraph gardens${SUBGRAPH_EXT}

# Deploy subgraph
if [ "$STUDIO" ]; then
  graph deploy --studio gardens${SUBGRAPH_EXT}
else
  graph deploy 1hive/gardens${SUBGRAPH_EXT} --ipfs ${IPFS_NODE} --node ${GRAPH_NODE} --deploy-key ${GRAPHKEY}
fi