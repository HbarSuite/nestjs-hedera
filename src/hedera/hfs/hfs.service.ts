import {
  FileAppendTransaction,
  FileContentsQuery,
  FileCreateTransaction,
  FileDeleteTransaction,
  FileId,
  FileInfo,
  FileInfoQuery,
  FileUpdateTransaction,
  Hbar,
  PrivateKey,
  Status
} from '@hashgraph/sdk';
import { Injectable, Logger } from '@nestjs/common';
import { ClientService } from '../client/client.service';

/**
 * Injectable
 */
@Injectable()
export class HfsService {

  /**
   * Logger Service
   */
  protected logger: Logger = new Logger("HFS Service");


  /**
   * HFS Service
   * @param {ClientService} clientService 
   */
  constructor(
    private clientService: ClientService
  ) { }

  /**
   * Create File
   * @param {PrivateKey} key 
   * @param {string} content 
   * @param {string} memo 
   * @param {number} maxTransactionFee 
   * @returns {FileId} 
   */
  async create(
    key: PrivateKey,
    content: string,
    memo?: string,
    maxTransactionFee?: number,
  ): Promise<FileId | null> {
    return new Promise(async (resolve, reject) => {
      try {

        /**
         * Creating the transaction...
         */
        const transaction = await new FileCreateTransaction()
          .setKeys([key])
          .setContents(content);

        if (memo) {
          transaction.setFileMemo(memo);
        }

        if (maxTransactionFee) {
          transaction.setMaxTransactionFee(new Hbar(maxTransactionFee));
        }

        transaction.freezeWith(this.clientService.getClient());


        /**
         * Signing with the file private keys...
         */
        const signTx = await transaction.sign(key);

        /**
         * Executing the transaction...
         */
        const submitTx = await signTx.execute(this.clientService.getClient());
        // 

        /**
         * Requesting the receipt...
         */
        const receipt = await submitTx.getReceipt(this.clientService.getClient());

        /**
         * Get the file ID...
         */
        resolve(receipt.fileId);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Append File
   * @param {FileId} fileId 
   * @param {PrivateKey} key 
   * @param {string} content 
   * @param {number} maxTransactionFee 
   * @returns {Status}
   */
  async append(
    fileId: FileId,
    key: PrivateKey,
    content: string,
    maxTransactionFee?: number,
  ): Promise<Status> {
    return new Promise(async (resolve, reject) => {
      try {

        /**
         * Creating the transaction...
         */
        const transaction = await new FileAppendTransaction()
          .setFileId(fileId)
          .setContents(content);

        if (maxTransactionFee) {
          transaction.setMaxTransactionFee(new Hbar(maxTransactionFee));
        }

        transaction.freezeWith(this.clientService.getClient());

        /**
         * Signing with the file private keys...
         */
        const signTx = await transaction.sign(key);

        /**
         * Executing the transaction...
         */
        const submitTx = await signTx.execute(this.clientService.getClient());

        /**
         * Requesting the receipt...
         */
        const receipt = await submitTx.getReceipt(this.clientService.getClient());

        /**
         * Get the transaction status...
         */
        resolve(receipt.status);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Update File
   * @param {FileId} fileId 
   * @param {string} content 
   * @param {PrivateKey} signKey 
   * @param {PrivateKey} newKey 
   * @param {string} memo 
   * @param {number} maxTransactionFee 
   * @returns {Status} 
   */
  async update(
    fileId: FileId,
    content: string,
    signKey: PrivateKey,
    newKey?: PrivateKey,
    memo?: string,
    maxTransactionFee?: number,
  ): Promise<Status> {
    return new Promise(async (resolve, reject) => {
      try {

        /**
         * Creating the transaction...
         */
        const transaction = await new FileUpdateTransaction()
          .setFileId(fileId)
          .setContents(content);

        if (memo) {
          transaction.setFileMemo(memo);
        }

        if (maxTransactionFee) {
          transaction.setMaxTransactionFee(new Hbar(maxTransactionFee));
        }

        if (newKey) {
          transaction.setKeys([newKey]);
        }

        transaction.freezeWith(this.clientService.getClient());

        /**
         * Signing the transaction...
         */
        let signTx = await transaction.sign(signKey);

        if (newKey) {
          signTx = await signTx.sign(newKey);
        }

        /**
         * Executing the transaction...
         */
        const submitTx = await signTx.execute(this.clientService.getClient());

        /**
         * Requesting the receipt...
         */
        const receipt = await submitTx.getReceipt(this.clientService.getClient());

        /**
         * Get the transaction status...
         */
        resolve(receipt.status);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Delete File
   * @param {FileId} fileId 
   * @param {PrivateKey} key 
   * @param {number} maxTransactionFee 
   * @returns {Status} 
   */
  async delete(
    fileId: FileId,
    key: PrivateKey,
    maxTransactionFee?: number,
  ): Promise<Status> {
    return new Promise(async (resolve, reject) => {
      try {

        /**
         * Creating the transaction...
         */
        const transaction = await new FileDeleteTransaction()
          .setFileId(fileId);

        if (maxTransactionFee) {
          transaction.setMaxTransactionFee(new Hbar(maxTransactionFee));
        }

        transaction.freezeWith(this.clientService.getClient());

        /**
         * Signing with the file private keys...
         */
        const signTx = await transaction.sign(key);

        /**
         * Executing the transaction...
         */
        const submitTx = await signTx.execute(this.clientService.getClient());

        /**
         * Requesting the receipt...
         */
        const receipt = await submitTx.getReceipt(this.clientService.getClient());

        /**
         * Get the transaction status...
         */
        resolve(receipt.status);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Get contents
   * @param {FileId} fileId 
   * @returns {string}
   */
  async getContents(
    fileId: FileId
  ): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {

        /**
         * Creating the transaction...
         */
        const transaction = new FileContentsQuery()
          .setFileId(fileId);

        /**
         * Signing the transaction...
         */
        const contents = await transaction.execute(this.clientService.getClient());
        resolve(contents.toString());
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Get Info
   * @param {FileId} fileId 
   * @returns {FileInfo}
   */
  async getInfos(
    fileId: FileId
  ): Promise<FileInfo> {
    return new Promise(async (resolve, reject) => {
      try {

        /**
         * Creating the transaction...
         */
        const transaction = new FileInfoQuery()
          .setFileId(fileId);

        /**
         * Signing the transaction...
         */
        const infos = await transaction.execute(this.clientService.getClient());
        resolve(infos);
      } catch (error) {
        reject(error);
      }
    });
  }
}
