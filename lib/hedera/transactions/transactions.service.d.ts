import { Logger } from '@nestjs/common';
import { ClientService } from '../client/client.service';
import { PrivateKey, ScheduleId, Status, Transaction, TransactionId } from '@hashgraph/sdk';
/**
 * Injectable
 */
export declare class TransactionsService {
    private clientService;
    /**
     * Logger Service
     */
    protected logger: Logger;
    /**
     * Fetch transaction record query
     * @param {TransactionId} transactionId
     * @returns {any} receipt
     */
    constructor(clientService: ClientService);
    /**
     * Fetch transaction query
     * @param {TransactionId} transactionId
     * @returns {any} receipt
     */
    getTransactionQuery(transactionId: TransactionId): Promise<any>;
    /**
     * Fetch transaction receipt
     * @param {TransactionId} transactionId
     * @returns {any} receipt
     */
    getTransactionReceipt(transactionId: TransactionId): Promise<any>;
    /**
     * Sign scheduled transaction
     * @param {ScheduleId} scheduleId
     * @param {PrivateKey} key
     * @returns {Status}
     */
    signScheduledTransaction(scheduleId: ScheduleId, key: PrivateKey): Promise<Status>;
    /**
     * Create scheduled transaction
     * @param {Transaction} transactionToSchedule
     * @returns {ScheduleId}
     */
    createScheduledTransaction(transactionToSchedule: Transaction): Promise<ScheduleId | null>;
    /**
     * Get scheduled transaction
     * @param {string} scheduleId
     * @returns {any} info
     */
    getScheduledTrasaction(scheduleId: string): Promise<any>;
}
