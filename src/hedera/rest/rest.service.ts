import { Injectable, Inject, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { MirrorNode } from '../../types/mirror.types';

@Injectable()
export class RestService {
  protected logger: Logger = new Logger("Rest Transactions Service");

  constructor(
    @Inject('mirrorNode') private mirrorNode: MirrorNode,  
    private httpService: HttpService
  ) {}

  async call(endpoint: string): Promise<any> {
    return new Promise(async(resolve, reject) => {
      try {
        let headers = {};

        if(this.mirrorNode.apiKey) {
          headers = {
            'authorization': this.mirrorNode.apiKey
          }
        }

        let response = await this.httpService
        .get(
          `${this.mirrorNode.url}/api/v1/${endpoint}`,
          { headers: headers }).toPromise();
  
        resolve(response?.data);
      } catch(error) {
        reject(error);
      }      
    });   
  }
}
