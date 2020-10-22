import { AllWebhookMessages } from "@trustology/trustvault-nodejs-sdk";
import {
  isBitcoinTransactionWebhook,
  isEthereumTransactionWebhook,
} from "./utils";

// The rules MUST return a value of this enum
export enum RuleResult {
  FAIL = "FAIL",
  RETRY = "RETRY",
  PASS = "PASS",
}

/**
 * The example Rule interface is responsible for determining whether the transaction should be signed and submitted.
 * The logic to approve the transaction is completely up to you
 * @validateRule - given the webhook payload, determine whether the webhook event should be signed by returning true or false
 */
export interface Rule {
  validateRule: (webhook: AllWebhookMessages) => Promise<RuleResult>;
}

/*
 * All rules passed to this rule must `PASS` for this rule to `PASS`
 *
 */
export class AllRule implements Rule {
  private rules: Rule[];
  constructor(...rules: Rule[]) {
    if (rules.length === 0) {
      throw new Error("Must pass in at least one rule");
    }
    this.rules = rules;
  }

  public async validateRule(webhook: AllWebhookMessages) {
    let result: RuleResult = RuleResult.PASS;
    let i = 0;
    while (result !== RuleResult.FAIL && i < this.rules.length) {
      const response = await this.rules[i++].validateRule(webhook);
      if (result === RuleResult.PASS) {
        result = response;
      } else {
        // RETRY
        result =
          response === RuleResult.FAIL ? RuleResult.FAIL : RuleResult.RETRY;
      }
    }

    return result;
  }
}

/**
 * Any of the rules passed in must `PASS` for this rule to `PASS`
 */
export class AnyRule implements Rule {
  private rules: Rule[];
  constructor(...rules: Rule[]) {
    if (rules.length === 0) {
      throw new Error("Must pass in at least one rule");
    }
    this.rules = rules;
  }
  public async validateRule(webhook: AllWebhookMessages) {
    let result: RuleResult = RuleResult.FAIL;
    let i = 0;
    while (result !== RuleResult.PASS && i < this.rules.length) {
      const response = await this.rules[i++].validateRule(webhook);
      if (result === RuleResult.FAIL) {
        result = response;
      } else {
        // RETRY
        result =
          response === RuleResult.PASS ? RuleResult.PASS : RuleResult.RETRY;
      }
    }

    return result;
  }
}

/**
 * You can pass a specific rule for ETH and one for BTC. The correct rule is evaulated based on the webhook asset type.
 * i.e if called with a BTC webhook the BTC rule is applied
 */
export class AssetRule implements Rule {
  constructor(private ethRule: Rule, private btcRule: Rule) {}

  public async validateRule(webhook: AllWebhookMessages) {
    if (isEthereumTransactionWebhook(webhook)) {
      return this.ethRule.validateRule(webhook);
    } else if (isBitcoinTransactionWebhook(webhook)) {
      return this.btcRule.validateRule(webhook);
    } else {
      return RuleResult.FAIL;
    }
  }
}

/**
 * Always return `FAIL`
 */
export class AlwaysFalseRule implements Rule {
  public async validateRule(webhook: AllWebhookMessages) {
    return RuleResult.FAIL;
  }
}

/**
 * Always return `PASS`
 */
export class AlwaysTrueRule implements Rule {
  public async validateRule(webhook: AllWebhookMessages) {
    return RuleResult.PASS;
  }
}

/**
 * Always return `RETRY`
 */
export class AlwaysRetryRule implements Rule {
  public async validateRule(webhook: AllWebhookMessages) {
    return RuleResult.RETRY;
  }
}
