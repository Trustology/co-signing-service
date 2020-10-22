import {
  BitcoinTransactionWebhookMessage,
  EthereumTransactionWebhookMessage,
  PolicyChangeRequestWebhookMessage,
} from "@trustology/trustvault-nodejs-sdk";

// example webhook payloads

// ethereum webhook transaction to sign
export const EthWebhook: EthereumTransactionWebhookMessage = {
  version: "1.0.0",
  type: "ETHEREUM_TRANSACTION_CREATED",
  payload: {
    assetSymbol: "ETH",
    chain: "ETHEREUM",
    signData: {
      transaction: {
        gasLimit: "21000",
        chainId: 3,
        v: "3",
        fromAddress: "0x4AE7775fF81C3b86A5ecbCE83E07bE2128ba47aa",
        to: "0x4AE7775fF81C3b86A5ecbCE83E07bE2128ba47aa",
        nonce: 6,
        value: "100000000000000",
        gasPrice: "367000000000",
      },
      hdWalletPath: ["0x8000002c", "0x8000003c", "0x80000000", "0x0", "0x0"],
      unverifiedDigestData: {
        transactionDigest: "601b552f9924cb20648a0ded278ffc17c4f8674fabb01224f0fc2aa3c51444fc",
        signData:
          "303f0420601b552f9924cb20648a0ded278ffc17c4f8674fabb01224f0fc2aa3c51444fc301b0205008000002c0205008000003c02050080000000020100020100",
        shaSignData: "61f839e8393a75ee709341ea6faf9e9043e0e55cc6c184b69fb01c354f6cdf20",
      },
    },
    requestId: "6e9af69c-6f79-a2f4-d36e-664d986f3fb4",
    subWalletId: {
      index: 0,
      id: "047d0890-fe88-4a30-9e0b-c85739a97630",
      type: "ETH",
    },
    trustId: "dd3fdfe9-11a6-4a45-aa9c-ed8eaf1eaa3a",
    subWalletIdString: "047d0890-fe88-4a30-9e0b-c85739a97630/ETH/0",
  },
  messageId: "ea00d365-86bc-4782-935e-22bc6bc39c60",
  timestamp: 1600423817304,
  isoTimestamp: "2020-09-18T10:10:17.304Z",
};


// bitcoin webhook transaction to sign
export const BtcWebhook: BitcoinTransactionWebhookMessage = {
  messageId: "fd33a586-88d8-4c6e-8e2d-5a83fb19f3d6",
  type: "BITCOIN_TRANSACTION_CREATED",
  version: "1.0.0",
  payload: {
    signData: {
      transaction: {
        outputs: [
          {
            recipientAddress: "2MyL9Fe9GJrqevVMRKPgbSMtqEr3c5bLGVe",
            amountToSend: 10000,
          },
          {
            publicKeyProvenanceData: {
              path: ["0x80000031", "0x80000000", "0x80000000", "0x1", "0x0"],
              publicKey:
                "04bf7fee4192ccd88b7f4727a655ace6313a31115dfcab09b864430775bec1425267e170525a500c8aa4438ceafcc7c13b8498042250c74a9627aab532643abfa2",
              accountHSMProvenanceSignature:
                "dbaa7c0e78bf36b067478d1f05c063d1b47295b57e98ce89add2706110659ee43913a577a3a98a52c9af17adc697dff22460559eb907724567019fbd7c76533e",
              addressType: "COMPATIBILITY",
              unverifiedAddress: "2MyqHscwR6YJ7QokXyvku8VkZjDR54fdyQ2",
            },
            recipientAddress: "2MyqHscwR6YJ7QokXyvku8VkZjDR54fdyQ2",
            amountToSend: 52072,
          },
        ],
        sighash: 1,
        lockTime: 0,
        version: 1,
        inputs: [
          {
            publicKeyProvenanceData: {
              path: ["0x80000031", "0x80000000", "0x80000000", "0x0", "0x1"],
              publicKey:
                "0483455de928e37b110c4cc644bfdce216f9bd4ffb8dd8fa64855a5281d8bb68676124f3343094b4a7caf93caa929716cb141d3427619ee6789d9ac079172bd924",
              accountHSMProvenanceSignature:
                "6ea659e63ff20cbdab68280ab74758f6b35b35e7f1daa81885cb1b85b9e455842555e998b3a21d365e1eb10a72ae28189f45285bf1443ab92b080ea9f23a9cad",
              addressType: "COMPATIBILITY",
              unverifiedAddress: "2MyL9Fe9GJrqevVMRKPgbSMtqEr3c5bLGVe",
            },
            sequence: "ffffffff",
            outputIndex: 0,
            unverifiedDigestData: {
              signData:
                "303f0420d515fce3f911072b970c60c483baff15e4fe9e9f8b85d6c4d9ea1a2ac06693e7301b020500800000310205008000000002050080000000020100020101",
              shaSignData: "6527964b86e300654ba2bf8e37e176932dd37c51200b3d4aa2a1fbd36053edd6",
              transactionDigest: "d515fce3f911072b970c60c483baff15e4fe9e9f8b85d6c4d9ea1a2ac06693e7",
            },
            address: "2MyL9Fe9GJrqevVMRKPgbSMtqEr3c5bLGVe",
            txId: "452deb12583fcfaba53101dc6e567f13084a75bbb4dae2f9c1c6f82aaba5988b",
            value: 80000,
            script: "a91442bee1ba509612497dc5da2369ff6c3815fce67087",
          },
        ],
      },
    },
    subWalletIdString: "047d0890-fe88-4a30-9e0b-c85739a97630/BTC/0",
    trustId: "dd3fdfe9-11a6-4a45-aa9c-ed8eaf1eaa3a",
    requestId: "2c9d7f68-04a4-9260-8e2e-bf7570d0548a",
    fee: 123,
    subWalletId: {
      type: "BTC",
      index: 0,
      id: "047d0890-fe88-4a30-9e0b-c85739a97630",
    },
    assetSymbol: "BTC",
    chain: "BITCOIN",
  },
  isoTimestamp: "2020-09-17T17:46:46.213Z",
  timestamp: 1600364806213,
};

// policy change request transaction to sign
export const policyChangeRequestWebhook: PolicyChangeRequestWebhookMessage = {
  version: "1.0.0",
  type: "POLICY_CHANGE_REQUEST_CREATED",
  payload: {
    requestId: "4ae66b15-d072-be56-1939-28d829aaa93b",
    policyTemplate: {
      type: "POLICY_TEMPLATE",
      expiryTimestamp: 4294967295,
      delegateSchedules: [
        [
          {
            quorumCount: 1,
            keys: [
              "04ca1d3b7b545026c7891e76967db4872e6d4e42226a25a047ce1a459c866b17dd3b52bbb50460f07de886d6a6e689e591bc6deec9d26172a189317b3331916ec1",
            ],
          },
        ],
      ],
      recovererSchedules: [
        [
          {
            keys: [
              "0409eca5d742fa7bc31373bf18b14af9b102bbe51c729af2dd8067dc5bfd35e49eb1044b69d49fc72c350f55b814dbea65e21fe16870846258977d60eded612ec3",
            ],
            quorumCount: 1,
          },
        ],
        [
          {
            keys: [
              "04c7e851cd0138b37a5400ed09bb15317f905a241abb10cbaa8cd6fc75e70c9148453babc174237a4a50664e982ab286d8ed59dbba7a3308ff77ff2b5bc50ea76f",
            ],
            quorumCount: 1,
          },
        ],
      ],
    },
    recovererTrustVaultSignature:
      "5f906a39f025dd3e5f8ca2d48c4810431972dd28322605f1158c0aedfd28af72a7fcf42b9f4ef2ca4c83da8bc65651086c7b43e8b0cb3bcf285c76cb42a52c59",
    unverifiedDigestData: {
      signData:
        "3081f0020500ffffffff304c304a30480201013043044104ca1d3b7b545026c7891e76967db4872e6d4e42226a25a047ce1a459c866b17dd3b52bbb50460f07de886d6a6e689e591bc6deec9d26172a189317b3331916ec1308198304a3048020101304304410409eca5d742fa7bc31373bf18b14af9b102bbe51c729af2dd8067dc5bfd35e49eb1044b69d49fc72c350f55b814dbea65e21fe16870846258977d60eded612ec3304a30480201013043044104c7e851cd0138b37a5400ed09bb15317f905a241abb10cbaa8cd6fc75e70c9148453babc174237a4a50664e982ab286d8ed59dbba7a3308ff77ff2b5bc50ea76f",
      shaSignData: "58d8087d6a8e6628635d650a90652f5470f6943c47fbb3aaccae6c79112e5242",
    },
    walletId: "108eb6c8-f3a2-4539-9f36-d78e48396861",
    trustId: "dd3fdfe9-11a6-4a45-aa9c-ed8eaf1eaa3a",
  },
  messageId: "63165ba4-ff82-4130-92a9-25d24ee87fc5",
  timestamp: 1600420332458,
  isoTimestamp: "2020-09-18T09:12:12.458Z",
};
