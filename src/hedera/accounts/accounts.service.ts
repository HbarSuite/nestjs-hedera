import { Injectable, Logger } from '@nestjs/common';
import { ClientService } from '../client/client.service';
import { KeysService } from '../keys/keys.service';
import { TokenBalance } from '../../types/token_balance.types';
import { AccountBalance } from '../../types/account_balance.types';
import { PrivateKeyList } from '../../types/private-key-list.types';
import {
  AccountBalanceQuery,
  AccountCreateTransaction,
  AccountId,
  AccountInfo,
  AccountInfoQuery,
  AccountUpdateTransaction,
  Hbar,
  Key,
  PrivateKey,
  PublicKey,
  Status,
  TokenFreezeTransaction,
  TokenId,
  TokenUnfreezeTransaction
} from '@hashgraph/sdk';
import { AccountDetails } from '../../types/account_details.types';

/**
 * Injectable
 */
@Injectable()
export class AccountsService {
  /**
  * Logger Service
  */
  protected logger: Logger = new Logger("Accounts Service");

  /**
   * Constructor
   * @param {ClientService} clientService 
   * @param {KeysService} keysService 
   */
  constructor(
    private clientService: ClientService,
    private keysService: KeysService
  ) { }

  /**
   * Fetches specific Account Info
   * @param {AccountId | string} accountId 
   * @returns {AccountInfo}
   */
  async getInfo(accountId: AccountId | string): Promise<AccountInfo> {
    return new Promise(async (resolve, reject) => {
      try {
        const client = this.clientService.getClient();

        // Creating the transaction...
        const transaction = new AccountInfoQuery()
          .setAccountId(accountId);

        // Signing the transaction...
        const accountInfo = await transaction.execute(client);

        // resolving the account's info...
        resolve(accountInfo);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
 * Fetches Specific account public key
 * @param {AccountId} accountId 
 * @returns {any} Account Public Key
 */
  async getKeys(accountId: AccountId | string): Promise<PublicKey> {
    return new Promise(async (resolve, reject) => {
      try {
        const client = this.clientService.getClient();

        const accountInfo = await this.getInfo(accountId);
        resolve(<PublicKey>accountInfo.key);
      } catch (error) {
        reject(error);
      }
    });
  }


  /**
   * Updates Account
   * @param {AccountId} accountId 
   * @param {PrivateKey} signKey 
   * @param {PrivateKey} newKey 
   * @param {string} memo 
   * @returns {Status} Account Update
   */
  async updateAccount(
    accountId: AccountId | string,
    signKey: PrivateKey,
    newKey?: PrivateKey,
    memo?: string,
    maxAutomaticTokenAssociations?: number
  ): Promise<Status> {
    return new Promise(async (resolve, reject) => {
      try {
        const client = this.clientService.getClient();

        // Creating the transaction...
        const transaction = await new AccountUpdateTransaction()
          // setting single node accountId, as a workound for offline signature...
          .setNodeAccountIds([new AccountId(6)])
          .setAccountId(accountId);

        if (memo) {
          transaction.setAccountMemo(memo);
        }

        if(maxAutomaticTokenAssociations) {
          transaction.setMaxAutomaticTokenAssociations(maxAutomaticTokenAssociations);
        }

        if (newKey) {
          transaction.setKey(newKey);
        }

        transaction.freezeWith(client);

        // Signing the transaction...
        let signTx = await transaction.sign(signKey);

        if (newKey) {
          signTx = await signTx.sign(newKey);
        }

        // Signing the transaction with the client operator...
        const txResponse = await signTx.execute(client);

        // Request the receipt of the transaction...
        const receipt = await txResponse.getReceipt(client);

        // Get the transaction consensus status...
        resolve(receipt.status);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
 * Creates a single or multi-sig account
 * @param {number} balance 
 * @param {number} keysLength 
 * @param {number} keysThreshold 
 * @returns {AccountId, PrivateKey} single or multi-sig account
 */
  async createAccount(
    balance: number,
    keysLength: number,
    publicKeys?: Array<string>,
    keysThreshold?: number,
    maxAutomaticTokenAssociations?: number
  ): Promise<AccountDetails> {
    return new Promise(async (resolve, reject) => {
      try {
        const client = this.clientService.getClient();
        let key = null;

        if (keysLength > 1) {
          key = await this.keysService.generateKeyList(publicKeys, keysLength, keysThreshold);
        } else {
          key = await this.keysService.generateKey();
        }

        //Creating the transaction...
        const transaction = new AccountCreateTransaction()
          .setKey(keysLength > 1 ? (<PrivateKeyList>key).keyList : (<PrivateKey>key).publicKey)
          .setInitialBalance(new Hbar(balance));

        if(maxAutomaticTokenAssociations) {
          transaction.setMaxAutomaticTokenAssociations(maxAutomaticTokenAssociations);
        }

        // Executing the transactions...
        const txResponse = await transaction.execute(client);

        // Fetching the receipt...
        const receipt = await txResponse.getReceipt(client);

        // resolving the accountId...
        resolve(new AccountDetails(receipt.accountId, key));
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
 * Freezes account related to token ID
 * @param {AccountId} accountId 
 * @param {TokenId} tokenId 
 * @param {string} freezeKey 
 * @returns {Status}
 */
  async freezeAccount(accountId: AccountId, tokenId: TokenId, freezeKey: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const client = this.clientService.getClient();

        const transaction = await new TokenFreezeTransaction()
          .setAccountId(accountId)
          .setTokenId(tokenId)
          .freezeWith(client);

        const signTx = await transaction.sign(PrivateKey.fromString(freezeKey));
        const txResponse = await signTx.execute(client);
        const receipt = await txResponse.getReceipt(client);
        resolve({
          status: receipt.status,
          transaction_id: txResponse.transactionId.toString()
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
 * Unfreezes account related to token ID
 * @param {AccountId} accountId 
 * @param {TokenId} tokenId 
 * @param {string} freezeKey 
 * @returns {Status}
 */
  async unfreezeAccount(accountId: AccountId, tokenId: TokenId, freezeKey: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const client = this.clientService.getClient();

        const transaction = await new TokenUnfreezeTransaction()
          .setAccountId(accountId)
          .setTokenId(tokenId)
          .freezeWith(client);

        const signTx = await transaction.sign(PrivateKey.fromString(freezeKey));
        const txResponse = await signTx.execute(client);
        const receipt = await txResponse.getReceipt(client);
        resolve({
          status: receipt.status,
          transaction_id: txResponse.transactionId.toString()
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
 * Get query balance
 * @param {string} accountId 
 * @param {string} tokenId 
 * @returns {AccountBalance}
 */
  getQueryBalance(accountId: string | AccountId, tokenId?: string): Promise<AccountBalance> {
    return new Promise(async (resolve, reject) => {
      try {
        const client = this.clientService.getClient();

        const query = new AccountBalanceQuery()
          .setAccountId(accountId);

        const response = await query.execute(client);
        let balance = null;

        if (tokenId) {
          balance = {
            tokens: [{
              tokenId: tokenId,
              balance: response.tokens?._map.get(tokenId) ? Number(response.tokens._map.get(tokenId)?.toString()) : 0,
              decimals: response.tokens?._map.get(tokenId) ? Number(response.tokenDecimals?._map.get(tokenId)) : 0
            }],
            hbars: response.hbars
          };
        } else {
          let tokens = new Array<TokenBalance>();

          response.tokens?._map.forEach((value, tokenId) => {
            tokens.push({
              tokenId: tokenId,
              balance: response.tokens?._map.get(tokenId) ? Number(response.tokens._map.get(tokenId)?.toString()) : 0,
              decimals: response.tokens?._map.get(tokenId) ? Number(response.tokenDecimals?._map.get(tokenId)) : 0
            });
          });

          balance = {
            tokens: tokens,
            hbars: response.hbars
          };
        }

        resolve(balance);
      } catch (error) {
        reject(error);
      }
    });
  }
}
