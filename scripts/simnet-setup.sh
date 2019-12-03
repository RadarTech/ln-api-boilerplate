#!/usr/bin/env bash
set -e

# install jq, which is a command line JSON processor used in this project
if hash jq 2>/dev/null; then
    echo jq already installed
else
    case "$OSTYPE" in
      darwin*)  brew install jq ;;
      linux*)   sudo apt-get install jq ;;
      msys*)    chocolatey install jq ;;
      *)        echo "unknown: $OSTYPE" ;;
    esac
fi

# start containers in test suite
docker-compose up -d simnet-btcd && sleep 5

# generate blocks to fund alice's wallet
docker-compose run simnet-btcctl generate 500 > /dev/null && sleep 5

docker-compose up -d simnet-lnd-btcd-alice
docker-compose up -d simnet-lnd-btcd-bob
docker-compose up -d simnet-lnd-btcd-charlie && sleep 200

# retreive pubkey for bob
bob_btcd_pubkey=$(docker inspect -f "{{ index .Config.Labels \"lnd.pubkey\"}}" simnet-lnd-btcd-bob)

# retreive pubkey for alice
alice_btcd_pubkey=$(docker inspect -f "{{ index .Config.Labels \"lnd.pubkey\"}}" simnet-lnd-btcd-alice)

# retreive pubkey for charlie
charlie_btcd_pubkey=$(docker inspect -f "{{ index .Config.Labels \"lnd.pubkey\"}}" simnet-lnd-btcd-charlie)

# generate blocks to fund our address
docker-compose run simnet-btcctl generate 500 > /dev/null && sleep 200

# send on-chain funds to bob
bob_address=$(docker-compose exec simnet-lnd-btcd-bob lncli --chain bitcoin --network=simnet newaddress p2wkh | jq -r '.address')
docker-compose exec simnet-lnd-btcd-alice lncli --chain bitcoin --network=simnet sendcoins $bob_address 100000000

# generate blocks to process on-chain transfer
docker-compose run simnet-btcctl generate 5 > /dev/null

# send on-chain funds to charlie
charlie_address=$(docker-compose exec simnet-lnd-btcd-charlie lncli --chain bitcoin --network=simnet newaddress p2wkh | jq -r '.address')
docker-compose exec simnet-lnd-btcd-alice lncli --chain bitcoin --network=simnet sendcoins $charlie_address 100000000

# connect alice->bob
docker-compose exec simnet-lnd-btcd-alice lncli --chain bitcoin --network=simnet connect $bob_btcd_pubkey@simnet-lnd-btcd-bob && sleep 10

# generate an on-chain channel opening transaction
docker-compose exec simnet-lnd-btcd-alice lncli --chain bitcoin --network=simnet openchannel --node_key=$bob_btcd_pubkey --local_amt=1000000 && sleep 10

# generate blocks to process channel opening
docker-compose run simnet-btcctl generate 5 > /dev/null

# connect bob->charlie
docker-compose exec simnet-lnd-btcd-bob lncli --chain bitcoin --network=simnet connect $charlie_btcd_pubkey@simnet-lnd-btcd-charlie && sleep 5

# generate an on-chain channel opening transaction
docker-compose exec simnet-lnd-btcd-bob lncli --chain bitcoin --network=simnet openchannel --node_key=$charlie_btcd_pubkey --local_amt=1000000 && sleep 10

# generate blocks to process channel opening
docker-compose run simnet-btcctl generate 5 > /dev/null

# connect charlie->alice
docker-compose exec simnet-lnd-btcd-charlie lncli --chain bitcoin --network=simnet connect $alice_btcd_pubkey@simnet-lnd-btcd-alice && sleep 5

# generate an on-chain channel opening transaction
docker-compose exec simnet-lnd-btcd-charlie lncli --chain bitcoin --network=simnet openchannel --node_key=$alice_btcd_pubkey --local_amt=1000000 && sleep 10

# generate blocks to process channel opening
docker-compose run simnet-btcctl generate 5 > /dev/null
