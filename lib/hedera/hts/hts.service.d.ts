import { AccountId, PrivateKey, Status, TokenId, Transaction, TransactionReceipt, TokenNftInfo } from '@hashgraph/sdk';
import { Logger } from '@nestjs/common';
import { TransactionDetails } from '../../types/transaction_details.types';
import { ClientService } from '../client/client.service';
/**
 * Injectable
 */
export declare class HtsService {
    private clientService;
    /**
     * Logger Service
     */
    protected logger: Logger;
    /**
     * HTS Service
     * @param {ClientService} clientService
     */
    constructor(clientService: ClientService);
    /**
     * Associate Token
     * @param {AccountId} accountId
     * @param {TokenId} tokenId
     * @param {PrivateKey} key
     * @returns {Status}
     */
    associateToken(accountId: AccountId, tokenId: TokenId, keys: PrivateKey | Array<PrivateKey>): Promise<Status | undefined | any>;
    /**
     * Disassociate Token
     * @param {AccountId} accountId
     * @param {TokenId} tokenId
     * @param {PrivateKey} key
     * @returns {Status}
     */
    dissociateToken(accountId: AccountId, tokenId: TokenId, keys: PrivateKey | Array<PrivateKey>): Promise<Status | undefined>;
    /**
     * Pause Token
     * @param {TokenId} tokenId
     * @param {PrivateKey} pauseKey
     * @returns {Status}
     */
    pauseToken(tokenId: TokenId, pauseKey: PrivateKey): Promise<Status>;
    /**
     * Unpause Token
     * @param {TokenId} tokenId
     * @param {PrivateKey} pauseKey
     * @returns {Status}
     */
    unpauseToken(tokenId: TokenId, pauseKey: PrivateKey): Promise<Status>;
    /**
     * Mint NFT
     * @param {TokenId} tokenId
     * @param {PrivateKey} supplyKey
     * @param {string} CID
     * @returns {TransactionReceipt}
     */
    mintNftToken(tokenId: TokenId, CID: string, supplyKey?: PrivateKey | Array<PrivateKey>): Promise<TransactionReceipt | Transaction>;
    /**
     * Burn NFT
     * @param {TokenId} tokenId
     * @param {number} serialNumber
     * @param {PrivateKey} supplyKey
     * @returns {TransactionReceipt}
     */
    burnNftToken(tokenId: TokenId, serialNumber: number, supplyKey: PrivateKey): Promise<TransactionReceipt>;
    /**
     * Get NFT Info
     * @param {TokenId} tokenId
     * @param {number} serialNumber
     * @returns {TokenNftInfo[]}
     */
    getNftInfo(tokenId: TokenId, serialNumber: number): Promise<TokenNftInfo[]>;
    /**
     * Transfer HBAR
     * @param {number} amount
     * @param {AccountId} from
     * @param {AccountId} to
     * @param {string} memo
     * @param {PrivateKey} key
     * @returns {TransactionDetails}
     */
    transferHbar(amount: number, from: AccountId, to: AccountId, memo?: string, key?: PrivateKey): Promise<TransactionDetails | Transaction>;
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
    transferToken(tokenId: TokenId | Array<TokenId>, from: AccountId, to: AccountId, amount: number | Array<Number>, tokenDecimals: number | Array<Number>, memo?: string, key?: PrivateKey, hbarAmount?: number): Promise<TransactionDetails | Transaction>;
    /**
     * Atomic Swap
     * @param {Array<any>} swaps
     * @param {string} memo
     * @param {PrivateKey} key
     * @returns {TransactionDetails | Transaction}
     */
    atomicSwap(swaps: Array<any>, memo?: string, key?: PrivateKey): Promise<TransactionDetails | Transaction>;
    /**
     * Transfer NFT
     * @param {TokenId} tokenId
     * @param {AccountId} from
     * @param {AccountId} to
     * @param {number} serialNumber
     * @param {PrivateKey} key
     * @returns {TransactionDetails}
     */
    transferNftToken(tokenId: TokenId, from: AccountId, to: AccountId, serialNumber: number, key?: PrivateKey): Promise<TransactionDetails | Transaction>;
}
