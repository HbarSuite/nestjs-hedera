import { Logger } from '@nestjs/common';
import { PrivateKey } from '@hashgraph/sdk';
import { PrivateKeyList } from '../../types/private-key-list.types';
/**
 * Injectable
 */
export declare class KeysService {
    /**
     * Logger Service
     */
    protected logger: Logger;
    /**
     * KeyService class
     */
    constructor();
    /**
     * Generate Private Key
     * @returns {PrivateKey}
     */
    generateKey(): Promise<PrivateKey>;
    /**
     * Generate a list of Keys
     * @param {string} publicKeys
     * @param {number} length
     * @param {number} threshold
     * @returns {PrivateKeyList}
     */
    generateKeyList(publicKeys?: string[], length?: number, threshold?: number): Promise<PrivateKeyList>;
}
