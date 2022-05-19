import {
  AccountId,
  Hbar,
  PrivateKey,
  Status,
  TokenAssociateTransaction,
  TokenId,
  TokenMintTransaction,
  TokenPauseTransaction,
  TokenUnpauseTransaction,
  TokenDissociateTransaction,
  Transaction,
  TransferTransaction,
  TransactionReceipt,
  NftId,
  TokenNftInfoQuery,
  TokenNftInfo
} from '@hashgraph/sdk';
import { Injectable, Logger } from '@nestjs/common';
import { TransactionDetails } from '../../types/transaction_details.types';
import { ClientService } from '../client/client.service';

/**
 * Injectable
 */
@Injectable()
export class HtsService {

  /**
   * Logger Service
   */
  protected logger: Logger = new Logger("HTS Service");

  /**
   * HTS Service
   * @param {ClientService} clientService 
   */
  constructor(
    private clientService: ClientService
  ) { }

  /**
   * Associate Token
   * @param {AccountId} accountId 
   * @param {TokenId} tokenId 
   * @param {PrivateKey} key 
   * @returns {Status}
   */
  async associateToken(
    accountId: AccountId,
    tokenId: TokenId,
    key: PrivateKey
  ): Promise<Status | undefined> {
    return new Promise(async (resolve, reject) => {
      try {
        const transaction = await new TokenAssociateTransaction()
          .setAccountId(accountId)
          .setTokenIds([tokenId])
          .freezeWith(this.clientService.getClient());

        let signTx = await transaction.sign(key);
        const txResponse = await signTx.execute(this.clientService.getClient());
        const receipt = await txResponse.getReceipt(this.clientService.getClient());
        resolve(receipt.status);
      } catch (error) {
        reject(error);
      }
    })
  }

  /**
   * Disassociate Token
   * @param {AccountId} accountId 
   * @param {TokenId} tokenId 
   * @param {PrivateKey} key 
   * @returns {Status} 
   */
  async dissociateToken(
    accountId: AccountId,
    tokenId: TokenId,
    key: PrivateKey
  ): Promise<Status | undefined> {
    return new Promise(async (resolve, reject) => {
      try {
        const transaction = await new TokenDissociateTransaction()
          .setAccountId(accountId)
          .setTokenIds([tokenId])
          .freezeWith(this.clientService.getClient());

        let signTx = await transaction.sign(key);
        const txResponse = await signTx.execute(this.clientService.getClient());
        const receipt = await txResponse.getReceipt(this.clientService.getClient());
        resolve(receipt.status);
      } catch (error) {
        reject(error);
      }
    })
  }

  /**
   * Pause Token
   * @param {TokenId} tokenId 
   * @param {PrivateKey} pauseKey 
   * @returns {Status} 
   */
  async pauseToken(tokenId: TokenId, pauseKey: PrivateKey): Promise<Status> {
    return new Promise(async (resolve, reject) => {
      try {
        const transaction = new TokenPauseTransaction()
          .setTokenId(tokenId)
          .freezeWith(this.clientService.getClient());

        const signTx = await transaction.sign(pauseKey);
        const txResponse = await signTx.execute(this.clientService.getClient());
        const receipt = await txResponse.getReceipt(this.clientService.getClient());
        resolve(receipt.status);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Unpause Token
   * @param {TokenId} tokenId 
   * @param {PrivateKey} pauseKey 
   * @returns {Status} 
   */
  async unpauseToken(tokenId: TokenId, pauseKey: PrivateKey): Promise<Status> {
    return new Promise(async (resolve, reject) => {
      try {
        const transaction = new TokenUnpauseTransaction()
          .setTokenId(tokenId)
          .freezeWith(this.clientService.getClient());

        const signTx = await transaction.sign(pauseKey);
        const txResponse = await signTx.execute(this.clientService.getClient());
        const receipt = await txResponse.getReceipt(this.clientService.getClient());
        resolve(receipt.status);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Mint NFT
   * @param {TokenId} tokenId 
   * @param {PrivateKey} supplyKey 
   * @param {string} CID 
   * @returns {TransactionReceipt} 
   */
  async mintNftToken(
    tokenId: TokenId,
    supplyKey: PrivateKey,
    CID: string
  ): Promise<TransactionReceipt> {
    return new Promise(async (resolve, reject) => {
      try {
        const transaction = new TokenMintTransaction()
          .setTokenId(tokenId)
          .addMetadata(Buffer.from(CID))
          .freezeWith(this.clientService.getClient());

        const signTx = await transaction.sign(supplyKey);
        const txResponse = await signTx.execute(this.clientService.getClient());
        const receipt = await txResponse.getReceipt(this.clientService.getClient());
        resolve(receipt);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Get NFT Info
   * @param {TokenId} tokenId 
   * @param {number} serialNumber 
   * @returns {TokenNftInfo[]} 
   */
  async getNftInfo(
    tokenId: TokenId,
    serialNumber: number,
  ): Promise<TokenNftInfo[]> {
    return new Promise(async (resolve, reject) => {
      try {
        let nftId = new NftId(tokenId, serialNumber);
        let nftInfos = await new TokenNftInfoQuery()
          .setNftId(nftId)
          .execute(this.clientService.getClient());

        resolve(nftInfos);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Transfer HBAR
   * @param {number} amount 
   * @param {AccountId} from 
   * @param {AccountId} to 
   * @param {string} memo 
   * @param {PrivateKey} key 
   * @returns {TransactionDetails} 
   */
  async transferHbar(
    amount: number,
    from: AccountId,
    to: AccountId,
    memo?: string,
    key?: PrivateKey
  ): Promise<TransactionDetails | Transaction> {
    return new Promise(async (resolve, reject) => {
      try {

        /**
         * Creating a transaction...
         */
        const transaction = new TransferTransaction()
          .addHbarTransfer(from, new Hbar(-amount))
          .addHbarTransfer(to, new Hbar(amount));

        if (memo) {
          transaction.setTransactionMemo(memo);
        }

        if (key) {
          transaction.freezeWith(this.clientService.getClient());

          /**
           * signing the transaction with the sender key...
           */
          let signTx = await transaction.sign(key);

          /**
           * Submitting the transaction to a Hedera network...
           */
          const txResponse = await signTx.execute(this.clientService.getClient());

          /**
           * Requesting the receipt of the transaction...
           */
          const receipt = await txResponse.getReceipt(this.clientService.getClient());

          /**
           * Resolving the transaction consensus status...
           */
          resolve({
            status: receipt.status,
            transaction_id: txResponse.transactionId
          });
        } else {
          resolve(transaction);
        }

      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Transfer Token
   * @param {TokenId} tokenId 
   * @param {AccountId} from 
   * @param {AccountId} to 
   * @param {number} amount 
   * @param {number} tokenDecimals 
   * @param {string} memo 
   * @param {PrivateKey} key 
   * @returns {TransactionDetails} 
   */
  async transferToken(
    tokenId: TokenId,
    from: AccountId,
    to: AccountId,
    amount: number,
    tokenDecimals: number,
    memo?: string,
    key?: PrivateKey
  ): Promise<TransactionDetails | Transaction> {
    return new Promise(async (resolve, reject) => {
      try {

        /**
         * Creating the transfer transaction...
         */
        const transaction = await new TransferTransaction()
          .addTokenTransfer(tokenId, from, Number(-amount * (10 ** tokenDecimals)))
          .addTokenTransfer(tokenId, to, Number(amount * (10 ** tokenDecimals)));

        if (memo) {
          transaction.setTransactionMemo(memo);
        }

        if (key) {
          transaction.freezeWith(this.clientService.getClient());

          /**
           * Signing the transaction with the sender key...
           */
          let signTx = await transaction.sign(key);

          /**
           * Submitting the transaction to a Hedera network...
           */
          const txResponse = await signTx.execute(this.clientService.getClient());


          /**
           * Requesting the receipt of the transaction...
           */
          const receipt = await txResponse.getReceipt(this.clientService.getClient());

          /**
           * Resolving the transaction consensus status...
           */
          resolve({
            status: receipt.status,
            transaction_id: txResponse.transactionId
          });
        } else {
          resolve(transaction);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Transfer NFT
   * @param {TokenId} tokenId 
   * @param {AccountId} from 
   * @param {AccountId} to 
   * @param {number} serialNumber 
   * @param {PrivateKey} key 
   * @returns {TransactionDetails} 
   */
  async transferNftToken(
    tokenId: TokenId,
    from: AccountId,
    to: AccountId,
    serialNumber: number,
    key?: PrivateKey
  ): Promise<TransactionDetails | Transaction> {
    return new Promise(async (resolve, reject) => {
      try {

        /**
         * Creating the transfer transaction...
         */
        const transaction = await new TransferTransaction()
          .addNftTransfer(new NftId(tokenId, serialNumber), from, to);

        if (key) {
          transaction.freezeWith(this.clientService.getClient());

          /**
           * signing the transaction with the sender key...
           */
          let signTx = await transaction.sign(key);

          /**
           * Submitting the transaction to a Hedera network...
           */
          const txResponse = await signTx.execute(this.clientService.getClient());

          /**
           * Requesting the receipt of the transaction...
           */
          const receipt = await txResponse.getReceipt(this.clientService.getClient());

          /**
           * Resolving the transaction consensus status...
           */
          resolve({
            status: receipt.status,
            transaction_id: txResponse.transactionId
          });
        } else {
          resolve(transaction);
        }
      } catch (error) {
        reject(error);
      }
    });
  }
}
