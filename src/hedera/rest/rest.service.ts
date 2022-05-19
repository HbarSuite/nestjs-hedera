import { Injectable, Inject, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { MirrorNode } from '../../types/mirror.types';
import { HederaOptions } from '../../types/hedera_options.types';

/**
 * Injectable
 */
@Injectable()
export class RestService {

  /**
   * Mirror Node
   */
  private mirrorNode: MirrorNode;

  /**
   * Logger Service
   */
  protected logger: Logger = new Logger("Rest Transactions Service");

  /**
   * Rest Transaction Service
   * @param {HederaOptions} hederaOptions 
   * @param {HttpService} httpService 
   */
  constructor(
    @Inject('hederaOptions') private hederaOptions: HederaOptions,
    private httpService: HttpService
  ) {
    this.mirrorNode = this.hederaOptions.mirrorNode;
  }

  /**
   * Call Mirror Node
   * @param {string} endpoint 
   * @returns {any}
   */
  async call(endpoint: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let headers = {};

        if (this.mirrorNode.apiKey) {
          headers = {
            'authorization': this.mirrorNode.apiKey
          }
        }

        let response = await this.httpService
          .get(
            `${this.mirrorNode.url}/api/v1/${endpoint}`,
            { headers: headers }).toPromise();

        resolve(response?.data);
      } catch (error) {
        reject(error);
      }
    });
  }
}
