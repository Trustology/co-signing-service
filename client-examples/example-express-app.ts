import {
  AllWebhookMessages,
  AwsKmsKeyStore,
  SignDataBuffer,
  TrustVault,
} from "@trustology/trustvault-nodejs-sdk";
import bodyParser from "body-parser";
import express, { Request, Response } from "express";
import { RuleResult } from "../src/rules";
import { getClientCustomRules } from "./example-client-rules";

/**
 * This is an example server built with express that showcases how to use the TrustVault SDK combined with the TrustVault API and webhooks to automatically sign transactions given that they satisfy certain predefined conditions.
 * You can use this as a template to respond to webhook events and sign transactions that satisfy custom rules which you would like to have. From timestamp rules to smart contract rules, anything is possible.
 * For users that do not wish to implement their own rules then can contact Bitpanda Custody and we will implement them into our internal implementation of the co-signing-service
 */
const app = express();
app.use(bodyParser.json());
const port = 3000;

export const X_SHA2_SIGNATURE = "X-Sha2-Signature";

// this is your TrustVault API key. It allows you to manage your wallets via the TrustVault API. To learn more about the TrustVault API then go to https://developer.bitpandacustody.com/index.html. To onboard as a API user and get an API key then go to https://developer.bitpandacustody.com/onboarding.html
const getApiKey = () => "API_KEY";
// your webhook secret will be given to you by Bitpanda Custody. To learn more about webhooks go to https://developer.bitpandacustody.com/webhooks.html. To register your account to receive webhooks then contact Bitpanda Custody
const getWebhookSecret = () => "SECRET";
// If you decide to use AWS KMS as your key management service then this can be the function which retrieves the alias of the key.
const getKeyAlias = () => "AWS_KMS_KEY_ALIAS";

app.get("/", (req: Request, res: Response) => {
  console.info("Hello World!");
  res.send("Hello World!");
});

// the simplest example implementation of handling a webhook, validating the transaction matches the required rules and then signing.
app.post("/co-sign", async (req: Request<any, any, AllWebhookMessages>, res: Response) => {
  const { headers, body: webhookMessage } = req;
  console.info(`co-sign-service is called with ${JSON.stringify(webhookMessage)}`);
  let webhookAccepted = false;
  try {
    const xSignature: string = headers[X_SHA2_SIGNATURE] as string;
    // instantiate the trustvault SDK
    const trustVault = new TrustVault({ apiKey: getApiKey() });
    // validate the webhook was sent by TrustVault using the SDK. This will throw an error if it is not valid.
    TrustVault.validateWebhookSignature(JSON.stringify(webhookMessage), getWebhookSecret(), xSignature);
    console.info(`Webhook validation succeeded, responding 200 to the webhook`);
    // the webhook is correct thus return 200 now to stop the webhook service retrying
    res.send({ status: 200 });
    webhookAccepted = true;
    // retrieve the rules you want to apply
    const rule = await getClientCustomRules();
    // use your custom rules to validate whether the transaction should be signed
    const result = await rule.validateRule(webhookMessage);
    // other custom code and logging can be included here
    console.info(`transaction validateRule result: ${result}`);
    // check the result of the rule to decide whether to sign the transaction or not
    if (result === RuleResult.PASS) {
      console.info("transaction passed rule validation. signing and submitting signature");
      // sign the digests if the rules are satisfied (could take 20 seconds)
      await trustVault.signAndSubmitSignature(webhookMessage, (signData: SignDataBuffer) => {
        // we recommend you use AWS KMS for signing. However you can use any Implementation of the KeyStore class in the SDK.
        // AwsKmsKeyStore is a wrapper class to ensure KMS is configured correctly for signing. @see Bitpanda Custody github SDK: https://github.com/Trustology/trustvault-nodejs-sdk
        return new AwsKmsKeyStore(getKeyAlias()).sign(signData);
      });
      console.info(`webhook successfully handled`);
    } else {
      // notify the rules where not satisfied by the transaction
      console.info("proposed transaction did not satisfy the rules");
    }
  } catch (error) {
    // any internal server errors can be handled here
    if (!webhookAccepted) { 
      res.status(error.code || 500).send({ message: error.message });
    }
    // log and handle the error
    console.error(error)
    
  }
});

const server = app.listen(port, () => {
  console.info(`Beep Boop. co-signing service listening at http://localhost:${port}`);
});

export { app, server };
