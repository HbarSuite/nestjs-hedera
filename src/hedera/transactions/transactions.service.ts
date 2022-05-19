import { Injectable, Logger } from '@nestjs/common';
import { ClientService } from '../client/client.service';
import {
  PrivateKey,
  ScheduleCreateTransaction,
  ScheduleId,
  ScheduleInfoQuery,
  ScheduleSignTransaction,
  Status,
  Transaction,
  TransactionId,
  TransactionReceipt,
  TransactionReceiptQuery,
  TransactionRecordQuery,
  TransactionResponse
} from '@hashgraph/sdk';

/**
 * Injectable
 */
@Injectable()
export class TransactionsService {

  /**
   * Logger Service
   */
  protected logger: Logger = new Logger("Transactions Service");

  /**
   * Transactions Service
   * @param {ClientService} clientService 
   */
  constructor(
    private clientService: ClientService
  ) { }

  /**
   * Fetch transaction record query
   * @param {TransactionId} transactionId 
   * @returns {any} receipt
   */
  async getTransactionQuery(transactionId: TransactionId): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let transaction = new TransactionRecordQuery()
          .setTransactionId(transactionId)
          .setIncludeDuplicates(true);

        let receipt = await transaction.execute(this.clientService.getClient());
        resolve(receipt);
      } catch (error: any) {
        reject(error);
      }
    });
  }

  /**
   * Fetch transaction receipt
   * @param {TransactionId} transactionId 
   * @returns {any} receipt
   */
  async getTransactionReceipt(transactionId: TransactionId): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let transaction = new TransactionReceiptQuery()
          .setTransactionId(transactionId)
          .setIncludeDuplicates(true)
          .setIncludeChildren(true);

        let receipt = await transaction.execute(this.clientService.getClient());
        resolve(receipt);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Sign scheduled transaction
   * @param {ScheduleId} scheduleId 
   * @param {PrivateKey} key 
   * @returns {Status}
   */
  async signScheduledTransaction(scheduleId: ScheduleId, key: PrivateKey): Promise<Status> {
    return new Promise(async (resolve, reject) => {
      try {

        /**
         * Creating the transaction...
         */
        const transaction = await new ScheduleSignTransaction()
          .setScheduleId(scheduleId)
          .freezeWith(this.clientService.getClient())
          .sign(key);

        /**
         * Signing with the client operator key...
         */
        const txResponse = await transaction.execute(this.clientService.getClient());

        /**
         * Getting the receipt of the transaction...
         */
        const receipt = await txResponse.getReceipt(this.clientService.getClient());

        /**
         * Getting the transaction status...
         */
        resolve(receipt.status);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Create scheduled transaction
   * @param {Transaction} transactionToSchedule 
   * @returns {ScheduleId}
   */
  async createScheduledTransaction(transactionToSchedule: Transaction): Promise<ScheduleId | null> {
    return new Promise(async (resolve, reject) => {
      try {

        /**
         * Creating a schedule transaction...
         */
        let scheduledTransaction: ScheduleCreateTransaction = new ScheduleCreateTransaction()
          .setScheduledTransaction(transactionToSchedule);

        /**
         * Signing with the client operator key and submit the transaction to a Hedera network...
         */
        let txResponse: TransactionResponse = await scheduledTransaction.execute(this.clientService.getClient());

        /**
         * Requesting the receipt of the transaction...
         */
        let receipt: TransactionReceipt = await txResponse.getReceipt(this.clientService.getClient());

        /**
         * Getting the schedule ID...
         */
        let scheduleId: ScheduleId | null = receipt.scheduleId;
        resolve(scheduleId);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Get scheduled transaction
   * @param {string} scheduleId 
   * @returns {any} info
   */
  async getScheduledTrasaction(scheduleId: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const query = new ScheduleInfoQuery()
          .setScheduleId(scheduleId);

        const info = await query.execute(this.clientService.getClient());
        resolve(info);
      } catch (error) {
        reject(error);
      }
    });
  }
}
