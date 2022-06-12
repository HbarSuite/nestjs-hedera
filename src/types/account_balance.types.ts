import { Hbar } from "@hashgraph/sdk";
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