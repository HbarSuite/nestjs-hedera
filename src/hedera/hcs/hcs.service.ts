import {
  TopicCreateTransaction,
  TopicUpdateTransaction,
  TopicDeleteTransaction,
  TopicMessageSubmitTransaction,
  TopicMessageQuery,
  TopicMessage,
  TopicInfoQuery,
  TopicInfo,
  TopicId,
  PrivateKey,
  Status,
  Key,
  KeyList
} from '@hashgraph/sdk';
import { Injectable, Logger } from '@nestjs/common';
import { ClientService } from '../client/client.service';

/**
 * Injectable
 */
@Injectable()
export class HcsService {

  /**
   * Logger Service
   */
  protected logger: Logger = new Logger("HCS Service");

  /**
   * HCS Service
   * @param {ClientService} clientService 
   */
  constructor(
    private clientService: ClientService
  ) {
  }


  /**
   * Create topic
   * @param {PrivateKey} adminKey 
   * @param {Key} submitKey 
   * @param {string} memo 
   * @returns {TopicId}
   */
  createTopic(
    adminKey?: PrivateKey,
    submitKey?: Key | KeyList,
    memo?: string
  ): Promise<TopicId | null> {
    return new Promise(async (resolve, reject) => {
      try {

        /**
         * creating the transaction...
         */
        const transaction = new TopicCreateTransaction();
        let txResponse = null;

        /**
         * setting the admin key, if any...
         */
        if (adminKey) {
          transaction.setAdminKey(adminKey);
        }

        /**
         * setting the submit key, if any...
         */
        if (submitKey) {
          transaction.setSubmitKey(submitKey);
        }

        /**
         * setting the topic memo, if any...
         */
        if (memo) {
          transaction.setTopicMemo(memo);
        }

        /**
         * freezing the transaction...
         */
        transaction.freezeWith(this.clientService.getClient());


        /**
         * if there is an admin key, transaction must be signed...
         */
        if (adminKey) {
          const signTx = await transaction.sign(adminKey);
          txResponse = await signTx.execute(this.clientService.getClient());
        }

        /**
         * otherwise, we can just execute it...
         */
        else {
          txResponse = await transaction.execute(this.clientService.getClient());
        }

        /**
         * finally, fetching the topicId from the response...
         */
        const receipt = await txResponse.getReceipt(this.clientService.getClient());
        resolve(receipt.topicId);
      } catch (error) {
        reject(error);
      }
    });
  }



  /**
   * Update topic
   * @param {TopicId} topicId 
   * @param {PrivateKey} currentAdminKey 
   * @param {PrivateKey} adminKey 
   * @param {Key} submitKey 
   * @param {string} memo 
   * @returns {Status}
   */
  updateTopic(
    topicId: TopicId,
    currentAdminKey?: PrivateKey,
    adminKey?: PrivateKey,
    submitKey?: Key | KeyList,
    memo?: string
  ): Promise<Status> {
    return new Promise(async (resolve, reject) => {
      try {

        /**
         * creating the transaction...
         */
        const transaction = new TopicUpdateTransaction().setTopicId(topicId);
        let txResponse = null;

        /**
         * setting the new admin key, if any...
         */
        if (adminKey) {
          transaction.setAdminKey(adminKey);
        }

        /**
         * setting the new submit key, if any...
         */
        if (submitKey) {
          transaction.setSubmitKey(submitKey);
        }

        /**
         * setting the new topic memo, if any...
         */
        if (memo) {
          transaction.setTopicMemo(memo);
        }

        /**
         * freezing the transaction...
         */
        transaction.freezeWith(this.clientService.getClient());

        /**
         * if the transaction has got an admin key, we must use it to sign...
         */
        if (currentAdminKey) {
          let signTx = await transaction.sign(currentAdminKey);

          /**
           * if there is a new admin key, we must use it to double sign it...
           */
          if (adminKey) {
            signTx = await signTx.sign(adminKey);
          }

          /**
           * executing the transaction, after signatures...
           */
          txResponse = await signTx.execute(this.clientService.getClient());
        }

        /**
         * otherwise we can just sign the transaction...
         */
        else {
          txResponse = await transaction.execute(this.clientService.getClient());
        }

        /**
         * fetching the status of the executed transaction...
         */
        const receipt = await txResponse.getReceipt(this.clientService.getClient());
        resolve(receipt.status);
      } catch (error) {
        reject(error);
      }
    });
  }


  /**
   * Delete topic
   * @param {TopicId} topicId 
   * @param {PrivateKey} adminKey 
   * @returns {Status}
   */
  deleteTopic(
    topicId: TopicId,
    adminKey: PrivateKey
  ): Promise<Status> {
    return new Promise(async (resolve, reject) => {
      try {

        /**
         * creating the transaction, and freezing it...
         */
        const transaction = new TopicDeleteTransaction()
          .setTopicId(topicId)
          .freezeWith(this.clientService.getClient());

        /**
         * signing the transaction with admin key...
         */
        const signTx = await transaction.sign(adminKey);

        /**
         * fetching response...
         */
        const txResponse = await signTx.execute(this.clientService.getClient());
        const receipt = await txResponse.getReceipt(this.clientService.getClient());

        /**
         * resolving status...
         */
        resolve(receipt.status);
      } catch (error) {
        reject(error);
      }
    });
  }


  /**
   * Get topic info
   * @param {TopicId} topicId 
   * @returns {TopicInfo}
   */
  topicInfo(
    topicId: TopicId
  ): Promise<TopicInfo> {
    return new Promise(async (resolve, reject) => {
      try {

        /**
        * creating the transaction for the query...
        */
        const transaction = new TopicInfoQuery().setTopicId(topicId);
        const info = await transaction.execute(this.clientService.getClient());
        resolve(info);
      } catch (error) {
        reject(error);
      }
    });
  }


  /**
   * Submit Message
   * @param {TopicId} topicId 
   * @param {string} message 
   * @param {PrivateKey} submitKey 
   * @returns {string} 
   */
  submitMessage(
    topicId: TopicId,
    message: string | Uint8Array,
    submitKey?: PrivateKey
  ): Promise<string | undefined> {
    return new Promise(async (resolve, reject) => {
      try {
        let txResponse = null;

        /**
         * creating the transaction, setting topic and message...
         */
        const transaction = new TopicMessageSubmitTransaction()
          .setTopicId(topicId)
          .setMessage(message);

        /**
         * freezing the transaction...
         */
        transaction.freezeWith(this.clientService.getClient());

        /**
         * if there is an submit key, transaction must be signed...
         */
        if (submitKey) {
          const signTx = await transaction.sign(submitKey);
          txResponse = await signTx.execute(this.clientService.getClient());
        }

        /**
         * otherwise, we can just execute it...
         */
        else {
          txResponse = await transaction.execute(this.clientService.getClient());
        }

        /**
         * finally, fetching the status...
         */
        const receipt = await txResponse.getReceipt(this.clientService.getClient());
        resolve(receipt.topicSequenceNumber?.toString());
      } catch (error) {
        reject(error);
      }
    });
  }


  /**
   * Get topic message
   * @param {TopicId} topicId 
   * @param {any} callback 
   * @param {number} start 
   * @param {number} end 
   * @param {number} limit 
   * @returns {any} Subscription Message
   */
  getMessages(
    topicId: TopicId,
    callback: (message: any) => void,
    start?: number,
    end?: number,
    limit?: number
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {

        /**
         * creating the transaction...
         */
        const transaction = new TopicMessageQuery()
          .setTopicId(topicId);

        if (start !== undefined) {
          transaction.setStartTime(start);
        }

        if (end !== undefined) {
          transaction.setEndTime(end);
        }

        if (limit !== undefined) {
          transaction.setLimit(limit);
        }

        let subscription = transaction.subscribe(
          this.clientService.getClient(),
          null,
          (message) => callback(message)
        );

        resolve(subscription);
      } catch (error) {
        reject(error);
      }
    });
  }
}