import { Status, TransactionId } from "@hashgraph/sdk";

/**
 * Interface
 */
export interface TransactionDetails {

  /**
   * Transaction status
   */
  status: Status

  /**
   * Transaction id
   */
  transaction_id: TransactionId
}