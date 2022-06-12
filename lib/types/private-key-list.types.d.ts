import { KeyList, PrivateKey } from "@hashgraph/sdk";
/**
 * Interface
 */
export interface PrivateKeyList {
    /**
     * Array of Private keys
     */
    privateKeys: PrivateKey[];
    /**
     * List of keys
     */
    keyList: KeyList;
}
