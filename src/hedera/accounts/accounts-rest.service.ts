import { Injectable } from '@nestjs/common';
import { RestService } from '../rest/rest.service';

/**
 * Injectable
 */
@Injectable()
export class AccountsRestService {

  /**
   * Transaction Rest Service
   * @param {RestService} restService 
   */
  constructor(
    private restService: RestService
  ) { }

  /**
   * Fetch infos for a given AccountId
   * @param {string} accountId 
   * @returns {any} response
   */
  getInfos(accountId: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let transactions: any = [];

        let accountInfos = await this.restService
          .call(`accounts/${accountId}`);

        resolve(accountInfos);
      } catch (error) {
        reject(error);
      }
    });
  }
}
