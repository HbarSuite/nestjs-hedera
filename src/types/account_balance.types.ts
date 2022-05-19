import { Hbar } from "@hashgraph/sdk/lib/contract/ContractCreateFlow";
import { TokenBalance } from "./token_balance.types";

/**
 * Interface
 */
export interface AccountBalance {

  /**
   * HBAR
   */
  hbars: Hbar

  /**
   * Array of custom tokens
   */
  tokens: Array<TokenBalance>
}