import { RestService } from '../rest/rest.service';
/**
 * Injectable
 */
export declare class TransactionsRestService {
    private restService;
    /**
     * Transaction Rest Service
     * @param {RestService} restService
     */
    constructor(restService: RestService);
    /**
     * Fetch all transactions from timestamp
     * @param {string} timestamp
     * @param {string} accountId
     * @returns {any} response
     */
    getAllTransactionsFromTimestamp(timestamp: string, accountId: string): Promise<any>;
    /**
     * Fetch all transactions
     * @param {string} accountId
     * @param {string} filters
     * @returns {any} response
     */
    getAllTransactions(accountId: string, filters?: string): Promise<any>;
    /**
     * Fetch transaction by timestamp
     * @param {string} timestamp
     * @returns {any} response
     */
    getTransactionByTimestamp(timestamp: string): Promise<any>;
    /**
     * Fetch transaction by id
     * @param {string} transaction_id
     * @returns {any} response
     */
    getTransactionById(transaction_id: string): Promise<any>;
    /**
     * Fetch latest transactions
     * @param {string} accountId
     * @returns {any} response
     */
    getLatestTransactions(accountId: string): Promise<any>;
    /**
     * Fetch scheduled transaction
     * @param {string} transactionId
     * @returns {any} response
     */
    getScheduledTransaction(transactionId: string): Promise<any>;
}
