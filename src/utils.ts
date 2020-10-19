import {
  AllWebhookMessages,
  BitcoinTransactionWebhookMessage,
  EthereumTransactionWebhookMessage,
  PolicyChangeRequestWebhookMessage,
} from "@Trustology/trust-vault-nodejs-sdk";

export const isEthereumTransactionWebhook = (
  webhook: AllWebhookMessages
): webhook is EthereumTransactionWebhookMessage =>
  webhook.type === "ETHEREUM_TRANSACTION_CREATED";

export const isBitcoinTransactionWebhook = (
  webhook: AllWebhookMessages
): webhook is BitcoinTransactionWebhookMessage =>
  webhook.type === "BITCOIN_TRANSACTION_CREATED";

export const isPolicyChangeRequestWebhook = (
  webhook: AllWebhookMessages
): webhook is PolicyChangeRequestWebhookMessage =>
  webhook.type === "POLICY_CHANGE_REQUEST_CREATED";
