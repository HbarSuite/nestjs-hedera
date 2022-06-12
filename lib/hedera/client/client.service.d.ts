import { Client } from '@hashgraph/sdk';
import { Operator } from '../../types/operator.types';
import { HederaOptions } from '../../types/hedera_options.types';
/**
 * Injectable
 */
export declare class ClientService {
    private hederaOptions;
    /**
     * Client
     */
    private client;
    /**
     * Single Operator
     */
    private operator;
    /**
     * Array of Operators
     */
    private operators;
    /**
     * Network choice
     */
    private network;
    /**
     * Logger Service
     */
    private logger;
    /**
     * Hedera Network variables
     * @param {HederaOptions} hederaOptions
     */
    constructor(hederaOptions: HederaOptions);
    /**
     * If the client gives invalid node error...
     * @returns random operator...
     */
    getClient(): Client;
    /**
     * Gets a node operator
     * @returns {Operator}
     */
    getNodeOperator(): Operator;
}
