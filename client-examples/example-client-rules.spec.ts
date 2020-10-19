import { expect } from "chai";
import { Rule, RuleResult } from "../src/rules";
import { BtcWebhook, EthWebhook } from "../test-data/test-data.spec";
import {
  ALLOWED_ETH_ADDRESSES,
  DENIED_BTC_ADDRESSES,
  getClientCustomRules,
} from "./example-client-rules";

describe("example-client-rules", () => {
  const CustomClientRule: Rule = getClientCustomRules();

  describe("Eth Transaction Webhooks", async () => {
    it("should accept a valid Eth Transaction webhook", async () => {
      const webhook = { ...EthWebhook };
      webhook.payload.signData.transaction.to = ALLOWED_ETH_ADDRESSES[0];
      const result = await CustomClientRule.validateRule(webhook);
      expect(result).to.equal(RuleResult.PASS);
    });

    it("should not sign an eth transaction when the to address is not in the allowed list", async () => {
      const webhook = { ...EthWebhook };
      const randomAddress = "0x0aeeE23D16084d763e7a65577020C1f3d18804F2";
      webhook.payload.signData.transaction.to = randomAddress;
      const result = await CustomClientRule.validateRule(webhook);
      expect(result).to.equal(RuleResult.FAIL);
    });
  });

  describe("Btc Transaction Webhooks", async () => {
    it("should pass a valid btc transaction", async () => {
      const webhook = { ...BtcWebhook };
      const result = await CustomClientRule.validateRule(webhook);
      expect(result).to.equal(RuleResult.PASS);
    });

    it("should not sign a btc transaction when the to address is in the denied address list", async () => {
      const webhook = { ...BtcWebhook };
      webhook.payload.signData.transaction.outputs[0].recipientAddress =
        DENIED_BTC_ADDRESSES[0];
      const result = await CustomClientRule.validateRule(webhook);
      expect(result).to.equal(RuleResult.FAIL);
    });
  });
});
