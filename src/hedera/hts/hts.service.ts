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
  TokenNftInfo,
  TokenBurnTransaction
} from '@hashgraph/sdk';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
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
    keys: PrivateKey | Array<PrivateKey>
  ): Promise<Status | undefined | any> {
    return new Promise(async (resolve, reject) => {
      try {
        const client = this.clientService.getClient();
        // generating random number from 3 to 9, as a workound for offline signature...
        let nodeAccountId = Math.floor(Math.random() * (9 - 3 + 1) + 3);
        
        console.log("using account ID", (new AccountId(nodeAccountId)).toString());
        const transaction = await new TokenAssociateTransaction()
          // setting single node accountId, as a workound for offline signature...
          .setNodeAccountIds([new AccountId(nodeAccountId)])
          .setAccountId(accountId)
          .setTokenIds([tokenId])
          .freezeWith(client);

        let signTx = null;

        if(keys) {
          if (Array.isArray(keys)) {
            for (let i = 0; i < keys.length; i++) {
              signTx = await transaction.sign(keys[i]);
            };
          } else {
            signTx = await transaction.sign(keys);
          }
  
          const txResponse = await signTx.execute(client);
          const receipt = await txResponse.getReceipt(client);
          resolve(receipt.status);          
        } else {
          resolve(transaction);
        }
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
    keys: PrivateKey | Array<PrivateKey>
  ): Promise<Status | undefined> {
    return new Promise(async (resolve, reject) => {
      try {
        const client = this.clientService.getClient();

        const transaction = await new TokenDissociateTransaction()
          .setAccountId(accountId)
          .setTokenIds([tokenId])
          .freezeWith(client);

        let signTx = null;

        if (Array.isArray(keys)) {
          for (let i = 0; i < keys.length; i++) {
            signTx = await transaction.sign(keys[i]);
          };
        } else {
          signTx = await transaction.sign(keys);
        }

        const txResponse = await signTx.execute(client);
        const receipt = await txResponse.getReceipt(client);
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
        const client = this.clientService.getClient();

        const transaction = new TokenPauseTransaction()
          .setTokenId(tokenId)
          .freezeWith(client);

        const signTx = await transaction.sign(pauseKey);
        const txResponse = await signTx.execute(client);
        const receipt = await txResponse.getReceipt(client);
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
        const client = this.clientService.getClient();

        const transaction = new TokenUnpauseTransaction()
          .setTokenId(tokenId)
          .freezeWith(client);

        const signTx = await transaction.sign(pauseKey);
        const txResponse = await signTx.execute(client);
        const receipt = await txResponse.getReceipt(client);
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
    CID: string,
    supplyKey?: PrivateKey | Array<PrivateKey>
  ): Promise<TransactionReceipt | Transaction> {
    return new Promise(async (resolve, reject) => {
      try {
        const client = this.clientService.getClient();

        const transaction = new TokenMintTransaction()
          .setTokenId(tokenId)
          .addMetadata(Buffer.from(CID));

        if (supplyKey) {
          transaction.freezeWith(client);

          let signTx = null;

          if (Array.isArray(supplyKey)) {
            for (let i = 0; i < supplyKey.length; i++) {
              signTx = await transaction.sign(supplyKey[i]);
            };
          } else {
            signTx = await transaction.sign(supplyKey);
          }

          const txResponse = await signTx.execute(client);
          const receipt = await txResponse.getReceipt(client);
          resolve(receipt);
        } else {
          // if no key has been provided, we return the transasction to be wrapped
          // into a scheduled transaction to allow multisig threshold mechanism...
          resolve(transaction);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Burn NFT
   * @param {TokenId} tokenId 
   * @param {number} serialNumber 
   * @param {PrivateKey} supplyKey 
   * @returns {TransactionReceipt}
   */
  async burnNftToken(
    tokenId: TokenId,
    serialNumber: number,
    supplyKey: PrivateKey
  ): Promise<TransactionReceipt> {
    return new Promise(async (resolve, reject) => {
      try {
        const client = this.clientService.getClient();

        let transaction = await new TokenBurnTransaction()
          .setTokenId(tokenId)
          .setSerials([serialNumber])
          .freezeWith(client);

        const signTx = await transaction.sign(supplyKey);
        const txResponse = await signTx.execute(client);
        const receipt = await txResponse.getReceipt(client);

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
        const client = this.clientService.getClient();

        let nftId = new NftId(tokenId, serialNumber);
        let nftInfos = await new TokenNftInfoQuery()
          .setNftId(nftId)
          .execute(client);

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
        const client = this.clientService.getClient();

        // Creating a transaction...
        const transaction = new TransferTransaction()
          .addHbarTransfer(from, new Hbar(-amount))
          .addHbarTransfer(to, new Hbar(amount));

        if (memo) {
          transaction.setTransactionMemo(memo);
        }

        if (key) {
          transaction.freezeWith(client);

          // signing the transaction with the sender key...
          let signTx = await transaction.sign(key);

          // Submitting the transaction to a Hedera network...
          const txResponse = await signTx.execute(client);

          // Requesting the receipt of the transaction...
          const receipt = await txResponse.getReceipt(client);

          // Resolving the transaction consensus status...
          resolve({
            status: receipt.status,
            transaction_id: txResponse.transactionId
          });
        } else {
          // if no key has been provided, we return the transasction to be wrapped
          // into a scheduled transaction to allow multisig threshold mechanism...          
          resolve(transaction);
        }

      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Transfer Token
   * @param {TokenId | Array<TokenId>} tokenId 
   * @param {AccountId} from 
   * @param {AccountId} to 
   * @param {number | Array<Number>} amount 
   * @param {number | Array<Number>} tokenDecimals 
   * @param {string} memo 
   * @param {PrivateKey} key 
   * @returns {TransactionDetails | Transaction} 
   */
  async transferToken(
    tokenId: TokenId | Array<TokenId>,
    from: AccountId,
    to: AccountId,
    amount: number | Array<Number>,
    tokenDecimals: number | Array<Number>,
    memo?: string,
    key?: PrivateKey,
    hbarAmount?: number
  ): Promise<TransactionDetails | Transaction> {
    return new Promise(async (resolve, reject) => {
      try {
        const client = this.clientService.getClient();

        // Creating the transfer transaction...
        const transaction = await new TransferTransaction();

        if(hbarAmount) {
          transaction
          .addHbarTransfer(from, new Hbar(-hbarAmount))
          .addHbarTransfer(to, new Hbar(hbarAmount))
        }

        if (!Array.isArray(tokenId) && !Array.isArray(amount) && !Array.isArray(tokenDecimals)) {
          transaction
            .addTokenTransfer(tokenId, from, Number(-amount * (10 ** tokenDecimals)))
            .addTokenTransfer(tokenId, to, Number(amount * (10 ** tokenDecimals)));
        } else {
          if (Array.isArray(tokenId) && Array.isArray(amount) && Array.isArray(tokenDecimals)) {
            tokenId.forEach((token_id, index) => {
              transaction
                .addTokenTransfer(token_id, from, Number(-amount[index] * (10 ** Number(tokenDecimals[index]))))
                .addTokenTransfer(token_id, to, Number(+amount[index] * (10 ** Number(tokenDecimals[index]))));
            });
          }
        }

        if (memo) {
          transaction.setTransactionMemo(memo);
        }

        if (key) {
          transaction.freezeWith(client);

          // signing the transaction with the sender key...
          let signTx = await transaction.sign(key);

          // Submitting the transaction to a Hedera network...
          const txResponse = await signTx.execute(client);

          // Requesting the receipt of the transaction...
          const receipt = await txResponse.getReceipt(client);

          // Resolving the transaction consensus status...
          resolve({
            status: receipt.status,
            transaction_id: txResponse.transactionId
          });
        } else {
          // if no key has been provided, we return the transasction to be wrapped
          // into a scheduled transaction to allow multisig threshold mechanism...
          resolve(transaction);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Atomic Swap
   * @param {Array<any>} swaps 
   * @param {string} memo 
   * @param {PrivateKey} key 
   * @returns {TransactionDetails | Transaction} 
   */
  async atomicSwap(
    swaps: Array<any>,
    memo?: string,
    key?: PrivateKey
  ): Promise<TransactionDetails | Transaction> {
    return new Promise(async (resolve, reject) => {
      try {
        const client = this.clientService.getClient();

        // Creating the transfer transaction...
        const transaction = await new TransferTransaction();

        swaps.forEach(swap => {
          if(swap.token.id == 'HBAR') {
            transaction
            .addHbarTransfer(swap.from, new Hbar(-swap.amount.toFixed(8)))
            .addHbarTransfer(swap.to, new Hbar(swap.amount.toFixed(8)));
          } else {
            transaction
            .addTokenTransfer(swap.token.id, swap.from, Number(-swap.amount * (10 ** swap.token.decimals)))
            .addTokenTransfer(swap.token.id, swap.to, Number(swap.amount * (10 ** swap.token.decimals)));
          }
        });

        if (memo) {
          transaction.setTransactionMemo(memo);
        }

        if (key) {
          transaction.freezeWith(client);

          // signing the transaction with the sender key...
          let signTx = await transaction.sign(key);

          // Submitting the transaction to a Hedera network...
          const txResponse = await signTx.execute(client);

          // Requesting the receipt of the transaction...
          const receipt = await txResponse.getReceipt(client);

          // Resolving the transaction consensus status...
          resolve({
            status: receipt.status,
            transaction_id: txResponse.transactionId
          });
        } else {
          // if no key has been provided, we return the transasction to be wrapped
          // into a scheduled transaction to allow multisig threshold mechanism...
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
        const client = this.clientService.getClient();

        // Creating the transfer transaction...
        const transaction = await new TransferTransaction()
          .addNftTransfer(new NftId(tokenId, serialNumber), from, to);

        if (key) {
          transaction.freezeWith(client);

          // signing the transaction with the sender key...
          let signTx = await transaction.sign(key);

          // Submitting the transaction to a Hedera network...
          const txResponse = await signTx.execute(client);

          // Requesting the receipt of the transaction...
          const receipt = await txResponse.getReceipt(client);

          // Resolving the transaction consensus status...
          resolve({
            status: receipt.status,
            transaction_id: txResponse.transactionId
          });
        } else {
          // if no key has been provided, we return the transasction to be wrapped
          // into a scheduled transaction to allow multisig threshold mechanism...
          resolve(transaction);
        }
      } catch (error) {
        reject(error);
      }
    });
  }
}
