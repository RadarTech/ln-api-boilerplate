#!/usr/bin/env bash
set -e

get_cert() {
  IMAGE=$1
  echo "$(docker inspect -f "{{ index .Config.Labels \"lnd.b64_tls\"}}" $IMAGE | base64 --decode | sed -e ':a' -e 'N' -e '$!ba' -e 's/\n/ /g' -e 's/- /-\\n/g' -e 's/ -/\\n-/g')"
}

get_macaroon() {
  IMAGE=$1
  echo "$(docker inspect -f "{{ index .Config.Labels \"lnd.hex_macaroon\"}}" $IMAGE)"
}

ALICE_IMAGE="radarion/lnd-integration-alice-btcd:v1.2.3"
export ALICE_TLS_CERT=$(get_cert $ALICE_IMAGE)
export ALICE_MACAROON=$(get_macaroon $ALICE_IMAGE)

BOB_IMAGE="radarion/lnd-integration-bob-btcd:v1.2.3"
export BOB_TLS_CERT=$(get_cert $BOB_IMAGE)
export BOB_MACAROON=$(get_macaroon $BOB_IMAGE)

CHARLIE_IMAGE="radarion/lnd-integration-charlie-btcd:v1.2.3"
export CHARLIE_TLS_CERT=$(get_cert $CHARLIE_IMAGE)
export CHARLIE_MACAROON=$(get_macaroon $CHARLIE_IMAGE)


# output the required values and envs for simnet lnd containers
echo '#-------------------- ALICE (OUR NODE) --------------------'
echo "cert: \"$ALICE_TLS_CERT\""
echo "macaroon: \"$ALICE_MACAROON\""
echo
echo '#-------------------- BOB --------------------'
echo "cert: \"$BOB_TLS_CERT\""
echo "macaroon: \"$BOB_MACAROON\""
echo
echo '#-------------------- CHARLIE --------------------'
echo "cert: \"$CHARLIE_TLS_CERT\""
echo "macaroon: \"$CHARLIE_MACAROON\""
