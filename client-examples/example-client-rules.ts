import { AllWebhookMessages } from "@trustology/trustvault-nodejs-sdk";
import { AllRule, AssetRule, Rule, RuleResult } from "../src/rules";
import {
  isBitcoinTransactionWebhook,
  isEthereumTransactionWebhook,
} from "../src/utils";

export const ALLOWED_ETH_ADDRESSES = [
  "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
  "0x7CeBF303d8c69a6649f1de5f0014A1f733606Ee8",
].map((address) => address.toLowerCase());
export const DENIED_BTC_ADDRESSES = [
  "bc1q8fw7mq64lgz50glcl328jwpvc66npeqqk57dez",
  "bc1q36p0kzue6cqaa3kgqpad3sf7njmdaq96m4l00m",
].map((address) => address.toLowerCase());

/**
 * The client will need to implement their own rules. Here is an example of how to use our Rule Class to easily create a mixture of different rule logic
 * In this function, the following 2 rules are created:
 * @AllowedEthAddressesListRule - All ETH transactions must be sent to either 0x1f9840a85d5af5bf1d1762f925bdaddc4201f984 or 0x7CeBF303d8c69a6649f1de5f0014A1f733606Ee8. Any other addresses will fail
 * @DeniedBtcAddressesListRule - deny all BTC transactions that send to either bc1q8fw7mq64lgz50glcl328jwpvc66npeqqk57dez or bc1q36p0kzue6cqaa3kgqpad3sf7njmdaq96m4l00m. Any other addresses will pass
 * Theses 2 rules are combined into the final rule customClientRule.
 */
export const getClientCustomRules = () => {
  const AllowedEthAddressesListRule: Rule = new EthAllowOrDenyListToAddressRule(
    ALLOWED_ETH_ADDRESSES,
    Permission.ALLOW,
  );
  const DeniedBtcAddressesListRule: Rule = new BtcAllowOrDenyListToAddressRule(DENIED_BTC_ADDRESSES, Permission.DENY);

  const customClientRule = new AllRule(
    new AssetRule(AllowedEthAddressesListRule, DeniedBtcAddressesListRule)
  );
  return customClientRule;
};

enum Permission {
  ALLOW = "ALLOW",
  DENY = "DENY",
}

// only handles eth, defaults other asset rules to true
export class EthAllowOrDenyListToAddressRule implements Rule {
  constructor(private allowedRecipientAddresses: string[], private type: Permission) {}
  public async validateRule(webhook: AllWebhookMessages) {
    if (isEthereumTransactionWebhook(webhook)) {
      if (
        this.allowedRecipientAddresses.includes(webhook.payload.signData.transaction.to.toLowerCase()) ===
        (this.type === Permission.ALLOW)
      ) {
        return RuleResult.PASS;
      }
      return RuleResult.FAIL;
    }
    return RuleResult.PASS;
  }
}

// only handles btc, defaults other asset rules to true
export class BtcAllowOrDenyListToAddressRule implements Rule {
  constructor(private allowedRecipientAddresses: string[], private type: Permission) {}
  public async validateRule(webhook: AllWebhookMessages) {
    if (isBitcoinTransactionWebhook(webhook)) {
      if (
        this.allowedRecipientAddresses.includes(webhook.payload.signData.transaction.outputs[0].recipientAddress.toLowerCase()) ===
        (this.type === Permission.ALLOW)
      ) {
        return RuleResult.PASS;
      }
      return RuleResult.FAIL;
    }
    return RuleResult.PASS;
  }
}
