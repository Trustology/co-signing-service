# Co-Signing Service

The co-signing-service is an an open source example of how to co-sign TrustVault transactions under a given set of rules.
Transactions from TrustVault are sent via a webhook to the co-signing-service endpoint; where each transaction is then checked if it satisfies the rules that you require. If all rules are satisfied then the co-signing-service signs the transaction and submits the signature back to TrustVault.

## Brief introduction to the TrustVault Platform

TrustVault is the entry point for securely managing your customers’ or clients’ wallets. In brief you will be able to create BIP32 compatible wallets for Bitcoin, Ethereum (and ERC20) and Binance Chain. You will then be able to:

- View the balance of your assets
- Send Assets to anyone (or whitelisted addresses only)
- View history of transactions (export to CSV also)
- Create Bitcoin receive addresses and view transactions on each address
- Enforce whitelist withdrawal to your exchanges by signing up to the Exchange Service

You can do all of the above via the [TrustVault iOS App](https://apps.apple.com/gb/app/trustvault/id1455959680) or the [TrustVault API](https://developer.trustology.io/trust-api/index.html). [Webhooks](https://developer.trustology.io/webhooks.html) can also be used to communicate with your system in an event based manner. You can read more about TrustVault [here](https://developer.trustology.io).

The co-signing service will use:

- Javascript TrustVault SDK to communicate to the TrustVault API
- Webhooks to receive events from TrustVault

## Co-signing service

The purpose of the co-signing-service is is to showcase how you can easily create custom rules and conditions to make your approval process more secure and automatic. Broadly speaking, the co-signing-service just combines a few key functions of the TrustVault SDK. Thus you are free to break up and combine any of the these to better suit your requirements.

This example code showcases:

- verification of the webhook endpoint ([More on webhooks and verification](https://developer.trustology.io/webhooks.html#Webhook-Security))
- creating the rules you would like to enforce
- validating the transaction satisfies all rules
- processing and submitting the transaction
  - creating the digest of the transactions that needs to be signed via the SDK
  - signing the digests using your own KeyStore interface (or using the TrustVault SDK's own AWS Key Store example)
  - submitting signatures to TrustVault via the SDK.

The steps that you are required to do are:

- create your own set of rules which define under what conditions your webhook events are signed
- create your own key store which will sign data using the private key securely stored in you key management service (we recommend you use [AWS KMS](https://aws.amazon.com/kms/)

## Preliminary steps

To begin using the co-signing-service immediately you would need to have already done the following:

- Sign up for [API Access](https://developer.trustology.io/onboarding.html) and get your API key
- Have created your own private public key pair and [updated the relevant wallet policies](https://developer.trustology.io/change-policy.html).

For more information see [Getting Started](https://developer.trustology.io/getting-started.html)

## Rules

The co-signing-service's purpose is to control and restrict the types of transactions that you (or your users/clients) can do. Thus a flexible and robust rule engine is critical to this goal. There are many different types of rules you might want, here are a few examples of what you can do:

- Threshold - only allow transactions under X ETH (or \$Y)
- Allow Lists - only allow transactions to a set of predefined addresses
- Deny Lists - block transactions sent to a set of predefined addresses
- Time Rules - Only allow transactions at certain times of the day (9:00 - 17:00)
- Smart Contract Rules - Allow only certain types of smart contract calls with specific payloads

Trustology is implementing their own set of common rules for you to use "out of the box". Contact us to integrate your own custom rules for you.

## Example Express Server

An example express server was created in order to show how you might use the co-signing-service.
First you would register a webhook with TrustVault to send transactions to the POST `/co-sign` endpoint. Now every newly created transaction will be sent to this endpoint and your custom rules will decided if it is signed or not.

To run the server do

```
npm start
```

The server will run on port `3000`. Verify your server is running by calling on your command line

```
curl http://localhost:3000
```

You should receive `Hello World!`

The signing endpoint is under `http://localhost:3000/co-sign` which shows an example implementation of Allow and Deny list rules (allowing/blocking transactions depending on the to-address of the transaction).

In some cases a rule can only be signed at a later date. Thus the client might want to implement a retry capability. An example of this is shown on the `http://localhost:3000/co-sign-with-retry` endpoint.

### Tests

run tests by calling

```
npm run test // for all tests
npm run client-test // for all tests
npm run css-test // for co-signing-service tests
```

#### Example Test Data

Example webhook payloads can be found in [test-data.spec.ts](./test-data/test-data.spec.ts) file.
