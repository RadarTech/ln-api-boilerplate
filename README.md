# ln-api-boilerplate

A boilerplate example project for creating lightning-enabled applications

[![CircleCI](https://img.shields.io/circleci/project/github/RadarTech/ln-api-boilerplate/master.svg?style=flat)](https://circleci.com/gh/RadarTech/ln-api-boilerplate)
[![Known Vulnerabilities](https://snyk.io/test/github/RadarTech/ln-api-boilerplate/badge.svg?targetFile=package.json)](https://snyk.io/test/github/RadarTech/ln-api-boilerplate?targetFile=package.json)
[![License](https://img.shields.io/github/license/radartech/ln-api-boilerplate.svg?style=flat)](https://img.shields.io/github/license/radartech/ln-api-boilerplate.svg?style=flat)

## Quickstart

This project contains three simnet nodes for local testing. By default, the example environment variables in `.env.example` have been populated with values that target our simnet node. You can replace these values in your `.env` file to target your own node.

### Install Dependencies
```sh
yarn
```

If the following error is thrown, run `npm rebuild`:

```
Error: Failed to load gRPC binary module because it was not installed for the current system
```

### Setup the simnet environment

For more details on the simnet suite, read the [simnet suite](#simnet-suite) section.

```sh
scripts/simnet-setup.sh
```

### Create your environment file

As noted above, you can copy the values from `.env.example` to `.env` to get up and running against the local simnet node. Update the values in your `.env` file at any time to target your own node.

```sh
cp .env.example .env
```

### Run the application

```sh
yarn start
```

### Run tests

```sh
yarn test
```

### Compile for production
```sh
yarn build
```

## Usage

```sh
$ curl -GET localhost:3000/api
# {"ok":true}
```

Ping the server:

```sh
$ curl -GET localhost:3000/api/ping
# "pong"
```

Generate a [bolt11](https://github.com/lightningnetwork/lightning-rfc/blob/master/11-payment-encoding.md) encoded invoice:

```sh
$ curl -GET localhost:3000/api/invoice
# "lntb10..."
```

Pay a [bolt11](https://github.com/lightningnetwork/lightning-rfc/blob/master/11-payment-encoding.md) encoded invoice:

```sh
$ curl -d "invoice=lntb10..." -X POST localhost:3000/api/invoice/pay
# {"preimage":"649..."}
```

## Simnet Suite

The `simnet-setup.sh` script will start containers necessary for local testing.

These include:
* A bitcoin simnet node
* Three Bitcoin LND nodes (with channels open to eachother)

The channels have been opened in a cicular pattern. You can update the channel opening strategy in `scripts/simnet-setup.sh` if the current setup is not sufficient for your use-case.

By default, channels have been opened in the following directions:

![nodes](https://user-images.githubusercontent.com/20102664/67313907-0ae29e00-f4c1-11e9-8246-bd7aa41e6876.png)

You can also interect with LND and BTCD using CLI commands.

**Useful examples:**

Generate a block:

```sh
docker-compose run simnet-btcctl generate 1
```

Create an invoice:

```sh
docker-compose exec simnet-lnd-btcd-alice lncli --chain bitcoin --network=simnet addinvoice 1000
```

Send on-chain funds from alice to an address:

```sh
docker-compose exec simnet-lnd-btcd-alice lncli --chain bitcoin --network=simnet sendcoins --addr=some_simnet_bitcoin_address --amt=100000
```


## VS Code Debugging

If you use VS Code, you can debug the application and tests using the built-in debugger.

Enter the debug view by clicking the Debug icon in the Activity Bar or using the keyboard shortcut `cmd + shift + D`

![screen shot 2019-02-04 at 9 54 08 am](https://user-images.githubusercontent.com/20102664/52223583-2fc7b000-2863-11e9-9686-7289614742ed.png)

There are three debug options:

- Launch & Debug Application - Launch the application with ts-node and debug
- Debug Tests - Start the tests and debug
- Attach Debugger to Process - Attach the to debugger to a running process

Note: The debugger can also be launched from the status bar.

![screen shot 2019-02-04 at 10 01 08 am](https://user-images.githubusercontent.com/20102664/52223860-d2802e80-2863-11e9-8eb8-f46a3788714d.png)

## Resources

- [Lightning Network Introduction](https://ion.radar.tech/)
- [Lightning Network Daemon](https://github.com/lightningnetwork/lnd)
- [lnrpc](https://github.com/RadarTech/lnrpc)

## Contributors

To develop on the project please run:

```sh
git clone git@github.com:RadarTech/ln-api-boilerplate.git && cd $_

yarn # OR npm install
yarn start # OR npm run start
```

## License

This project is licensed under the MIT License.