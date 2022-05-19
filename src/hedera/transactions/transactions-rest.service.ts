import { Injectable } from '@nestjs/common';
import { RestService } from '../rest/rest.service';

/**
 * Injectable
 */
@Injectable()
export class TransactionsRestService {

  /**
   * Transaction Rest Service
   * @param {RestService} restService 
   */
  constructor(
    private restService: RestService
  ) { }

  /**
   * Fetch all transactions from timestamp
   * @param {string} timestamp 
   * @param {string} accountId 
   * @returns {any} response
   */
  getAllTransactionsFromTimestamp(timestamp: string, accountId: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let transactions: any = [];

        let response = await this.restService
          .call(`transactions/?account.id=${accountId}&timestamp=gt:${timestamp}`);

        transactions = transactions.concat(response.transactions);

        while (response.links.next) {
          let nextArray = response.links.next.split("&");
          let next = nextArray.slice(1, nextArray.length).join('&');

          await new Promise(resolve => setTimeout(resolve, 1000));

          response = await this.restService
            .call(`transactions/?account.id=${accountId}&${next}`);

          transactions = transactions.concat(response.transactions);
        }

        resolve(transactions);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Fetch all transactions
   * @param {string} accountId 
   * @param {string} filters 
   * @returns {any} response
   */
  getAllTransactions(accountId: string, filters?: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let transactions: any = [];
        let url = `transactions/?account.id=${accountId}`;

        if (filters) {
          url += `&${filters}`;
        }

        let response = await this.restService
          .call(url);

        transactions = transactions.concat(response.transactions);

        while (response.links.next) {
          let nextArray = response.links.next.split("&");
          let next = nextArray.slice(1, nextArray.length).join('&');

          await new Promise(resolve => setTimeout(resolve, 1000));

          response = await this.restService
            .call(`transactions/?account.id=${accountId}&${next}`);

          transactions = transactions.concat(response.transactions);
        }

        resolve(transactions);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Fetch latest transactions
   * @param {string} accountId 
   * @returns {any} response
   */
  getLatestTransactions(accountId: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await this.restService
          .call(`transactions/?account.id=${accountId}`);

        resolve(response);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Fetch scheduled transaction
   * @param {string} transactionId 
   * @returns {any} response
   */
  getScheduledTransaction(transactionId: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await this.restService
          .call(`schedules/${transactionId}`);

        resolve(response);
      } catch (error) {
        reject(error);
      }
    });
  }
}
