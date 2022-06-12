import { AccountId, PrivateKey } from "@hashgraph/sdk";
import { PrivateKeyList } from "./private-key-list.types";

/**
 * Interface
 */
export class AccountDetails {

  /**
   * accountId
   */
   private accountId: AccountId


  /**
   * key
   */
   private key: PrivateKey | PrivateKeyList

   constructor(accountId, key) {
    this.accountId = accountId;
    this.key = key;
   }
}