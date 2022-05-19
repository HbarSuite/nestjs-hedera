import { 
  AccountBalanceQuery,
  AccountCreateTransaction, 
  AccountId, 
  AccountInfo, 
  AccountInfoQuery, 
  AccountUpdateTransaction, 
  Hbar,
  PrivateKey,
  Status, 
  TokenFreezeTransaction, 
  TokenId, 
  TokenUnfreezeTransaction
} from '@hashgraph/sdk';
import { Injectable, Logger } from '@nestjs/common';
import { ClientService } from '../client/client.service';
import { KeysService } from '../keys/keys.service';
import { TokenBalance } from '../../types/token_balance.types';
import { AccountBalance } from '../../types/account_balance.types';
import { PrivateKeyList } from '../../types/private-key-list.types';

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
  ) {}

  /**
   * Fetches specific Account Info
   * @param {AccountId} accountId 
   * @returns {AccountInfo}
   */
  async getInfo(accountId: AccountId): Promise<AccountInfo> {
    return new Promise(async(resolve, reject) => {
      try {
        /**
         * Creating the transaction...
         */
        const transaction = new AccountInfoQuery()
            .setAccountId(accountId);


        /**
         * Signing the transaction...
         */
        const accountInfo = await transaction.execute(this.clientService.getClient());

        /**
         * resolving the account's info...
         */
        resolve(accountInfo);        
      } catch(error) {
        reject(error);
      }
    });
  }

  /**
   * Fetches Specific account public key
   * @param {AccountId} accountId 
   * @returns {any} Account Public Key
   */
  async getKeys(accountId: AccountId): Promise<any> {
    return new Promise(async(resolve, reject) => {
      try {
        const accountInfo = await this.getInfo(accountId);
        resolve(<any>accountInfo.key);
      } catch(error) {
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
    accountId: AccountId,
    signKey: PrivateKey,
    newKey?: PrivateKey,
    memo?: string
  ): Promise<Status> {
    return new Promise(async(resolve,reject) => {
      try {
        /**
         * Creating the transaction...
         */
        const transaction = await new AccountUpdateTransaction()
         /**
         * setting single node accountId, as a workound for offline signature...
         */
            .setNodeAccountIds([new AccountId(6)])    
            .setAccountId(accountId);

            /**
             * If there is a memo...
             */
        if(memo) {
          transaction.setAccountMemo(memo);
        }

        /**
         * If there is a new key...
         */
        if(newKey) {
          transaction.setKey(newKey);
        }

        transaction.freezeWith(this.clientService.getClient());

        /**
         * Signing the transaction...
         */
        let signTx = await transaction.sign(signKey);

        if(newKey) {
          signTx = await signTx.sign(newKey);
        }

        /**
         * Signing the transaction with the client operator...
         */
        const txResponse = await signTx.execute(this.clientService.getClient());

        /**
         * Request the receipt of the transaction...
         */
        const receipt = await txResponse.getReceipt(this.clientService.getClient());

        /**
         * Get the transaction consensus status...
         */
        resolve(receipt.status);
      } catch(error) {
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
    keysThreshold?: number
  ): Promise<{accountId: AccountId | null, key: PrivateKey | PrivateKeyList}> {
    return new Promise(async(resolve,reject) => {
      try {
        let key = null;

        if(keysLength > 1) {
          key = await this.keysService.generateKeyList(undefined, keysLength, keysThreshold);
        } else {
          key = await this.keysService.generateKey();
        }

        /**
         * Creating the transaction...
         */
        const transaction = new AccountCreateTransaction()
            .setKey(keysLength > 1 ? (<PrivateKeyList>key).keyList : (<PrivateKey>key).publicKey)
            .setInitialBalance(new Hbar(balance));

        /**
         * Executing the transactions...
         */
        const txResponse = await transaction.execute(this.clientService.getClient());

        /**
         * Fetching the receipt...
         */
        const receipt = await txResponse.getReceipt(this.clientService.getClient());

        /**
         * resolving the accountId...
         */
        resolve({
          accountId: receipt.accountId,
          key: key
        });
      } catch(error) {
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
    return new Promise(async(resolve, reject) => {
      try {
        const transaction = await new TokenFreezeTransaction()
            .setAccountId(accountId)
            .setTokenId(tokenId)
            .freezeWith(this.clientService.getClient());

        const signTx = await transaction.sign(PrivateKey.fromString(freezeKey));   
        const txResponse = await signTx.execute(this.clientService.getClient());
        const receipt = await txResponse.getReceipt(this.clientService.getClient());
        resolve({
          status: receipt.status,
          transaction_id: txResponse.transactionId.toString()
        });
      } catch(error) {
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
    return new Promise(async(resolve, reject) => {
      try {
        const transaction = await new TokenUnfreezeTransaction()
            .setAccountId(accountId)
            .setTokenId(tokenId)
            .freezeWith(this.clientService.getClient());

        const signTx = await transaction.sign(PrivateKey.fromString(freezeKey));   
        const txResponse = await signTx.execute(this.clientService.getClient());
        const receipt = await txResponse.getReceipt(this.clientService.getClient());
        resolve({
          status: receipt.status,
          transaction_id: txResponse.transactionId.toString()
        });
      } catch(error) {
        reject(error);
      }
    });
  }

  /**
   * 
   * @param {string} accountId 
   * @param {string} tokenId 
   * @returns {AccountBalance}
   */
  getQueryBalance(accountId: string | AccountId, tokenId?: string): Promise<AccountBalance> {
    return new Promise(async (resolve, reject) => {
      try {
        const query = new AccountBalanceQuery()
          .setAccountId(accountId);

        const response = await query.execute(this.clientService.getClient());
        let balance = null;

        if(tokenId) {
          balance = {
            tokens: [{
              tokenId: tokenId,
              balance: response.tokens?._map.get(tokenId) ? Number(response.tokens._map.get(tokenId)?.toString()): 0,
              decimals: response.tokens?._map.get(tokenId) ? Number(response.tokenDecimals?._map.get(tokenId)): 0
            }],
            hbars: response.hbars
          };
        } else {
          let tokens = new Array<TokenBalance>();
          
          response.tokens?._map.forEach((value, tokenId) => {
            tokens.push({
              tokenId: tokenId,
              balance: response.tokens?._map.get(tokenId) ? Number(response.tokens._map.get(tokenId)?.toString()): 0,
              decimals: response.tokens?._map.get(tokenId) ? Number(response.tokenDecimals?._map.get(tokenId)): 0
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
