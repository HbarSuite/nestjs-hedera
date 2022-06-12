"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HtsService = void 0;
const sdk_1 = require("@hashgraph/sdk");
const common_1 = require("@nestjs/common");
const client_service_1 = require("../client/client.service");
/**
 * Injectable
 */
let HtsService = class HtsService {
    /**
     * HTS Service
     * @param {ClientService} clientService
     */
    constructor(clientService) {
        this.clientService = clientService;
        /**
         * Logger Service
         */
        this.logger = new common_1.Logger("HTS Service");
    }
    /**
     * Associate Token
     * @param {AccountId} accountId
     * @param {TokenId} tokenId
     * @param {PrivateKey} key
     * @returns {Status}
     */
    associateToken(accountId, tokenId, keys) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const client = this.clientService.getClient();
                    // generating random number from 3 to 9, as a workound for offline signature...
                    let nodeAccountId = Math.floor(Math.random() * (9 - 3 + 1) + 3);
                    console.log("using account ID", (new sdk_1.AccountId(nodeAccountId)).toString());
                    const transaction = yield new sdk_1.TokenAssociateTransaction()
                        // setting single node accountId, as a workound for offline signature...
                        .setNodeAccountIds([new sdk_1.AccountId(nodeAccountId)])
                        .setAccountId(accountId)
                        .setTokenIds([tokenId])
                        .freezeWith(client);
                    let signTx = null;
                    if (keys) {
                        if (Array.isArray(keys)) {
                            for (let i = 0; i < keys.length; i++) {
                                signTx = yield transaction.sign(keys[i]);
                            }
                            ;
                        }
                        else {
                            signTx = yield transaction.sign(keys);
                        }
                        const txResponse = yield signTx.execute(client);
                        const receipt = yield txResponse.getReceipt(client);
                        resolve(receipt.status);
                    }
                    else {
                        resolve(transaction);
                    }
                }
                catch (error) {
                    reject(error);
                }
            }));
        });
    }
    /**
     * Disassociate Token
     * @param {AccountId} accountId
     * @param {TokenId} tokenId
     * @param {PrivateKey} key
     * @returns {Status}
     */
    dissociateToken(accountId, tokenId, keys) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const client = this.clientService.getClient();
                    const transaction = yield new sdk_1.TokenDissociateTransaction()
                        .setAccountId(accountId)
                        .setTokenIds([tokenId])
                        .freezeWith(client);
                    let signTx = null;
                    if (Array.isArray(keys)) {
                        for (let i = 0; i < keys.length; i++) {
                            signTx = yield transaction.sign(keys[i]);
                        }
                        ;
                    }
                    else {
                        signTx = yield transaction.sign(keys);
                    }
                    const txResponse = yield signTx.execute(client);
                    const receipt = yield txResponse.getReceipt(client);
                    resolve(receipt.status);
                }
                catch (error) {
                    reject(error);
                }
            }));
        });
    }
    /**
     * Pause Token
     * @param {TokenId} tokenId
     * @param {PrivateKey} pauseKey
     * @returns {Status}
     */
    pauseToken(tokenId, pauseKey) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const client = this.clientService.getClient();
                    const transaction = new sdk_1.TokenPauseTransaction()
                        .setTokenId(tokenId)
                        .freezeWith(client);
                    const signTx = yield transaction.sign(pauseKey);
                    const txResponse = yield signTx.execute(client);
                    const receipt = yield txResponse.getReceipt(client);
                    resolve(receipt.status);
                }
                catch (error) {
                    reject(error);
                }
            }));
        });
    }
    /**
     * Unpause Token
     * @param {TokenId} tokenId
     * @param {PrivateKey} pauseKey
     * @returns {Status}
     */
    unpauseToken(tokenId, pauseKey) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const client = this.clientService.getClient();
                    const transaction = new sdk_1.TokenUnpauseTransaction()
                        .setTokenId(tokenId)
                        .freezeWith(client);
                    const signTx = yield transaction.sign(pauseKey);
                    const txResponse = yield signTx.execute(client);
                    const receipt = yield txResponse.getReceipt(client);
                    resolve(receipt.status);
                }
                catch (error) {
                    reject(error);
                }
            }));
        });
    }
    /**
     * Mint NFT
     * @param {TokenId} tokenId
     * @param {PrivateKey} supplyKey
     * @param {string} CID
     * @returns {TransactionReceipt}
     */
    mintNftToken(tokenId, CID, supplyKey) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const client = this.clientService.getClient();
                    const transaction = new sdk_1.TokenMintTransaction()
                        .setTokenId(tokenId)
                        .addMetadata(Buffer.from(CID));
                    if (supplyKey) {
                        transaction.freezeWith(client);
                        let signTx = null;
                        if (Array.isArray(supplyKey)) {
                            for (let i = 0; i < supplyKey.length; i++) {
                                signTx = yield transaction.sign(supplyKey[i]);
                            }
                            ;
                        }
                        else {
                            signTx = yield transaction.sign(supplyKey);
                        }
                        const txResponse = yield signTx.execute(client);
                        const receipt = yield txResponse.getReceipt(client);
                        resolve(receipt);
                    }
                    else {
                        // if no key has been provided, we return the transasction to be wrapped
                        // into a scheduled transaction to allow multisig threshold mechanism...
                        resolve(transaction);
                    }
                }
                catch (error) {
                    reject(error);
                }
            }));
        });
    }
    /**
     * Burn NFT
     * @param {TokenId} tokenId
     * @param {number} serialNumber
     * @param {PrivateKey} supplyKey
     * @returns {TransactionReceipt}
     */
    burnNftToken(tokenId, serialNumber, supplyKey) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const client = this.clientService.getClient();
                    let transaction = yield new sdk_1.TokenBurnTransaction()
                        .setTokenId(tokenId)
                        .setSerials([serialNumber])
                        .freezeWith(client);
                    const signTx = yield transaction.sign(supplyKey);
                    const txResponse = yield signTx.execute(client);
                    const receipt = yield txResponse.getReceipt(client);
                    resolve(receipt);
                }
                catch (error) {
                    reject(error);
                }
            }));
        });
    }
    /**
     * Get NFT Info
     * @param {TokenId} tokenId
     * @param {number} serialNumber
     * @returns {TokenNftInfo[]}
     */
    getNftInfo(tokenId, serialNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const client = this.clientService.getClient();
                    let nftId = new sdk_1.NftId(tokenId, serialNumber);
                    let nftInfos = yield new sdk_1.TokenNftInfoQuery()
                        .setNftId(nftId)
                        .execute(client);
                    resolve(nftInfos);
                }
                catch (error) {
                    reject(error);
                }
            }));
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
    transferHbar(amount, from, to, memo, key) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const client = this.clientService.getClient();
                    // Creating a transaction...
                    const transaction = new sdk_1.TransferTransaction()
                        .addHbarTransfer(from, new sdk_1.Hbar(-amount))
                        .addHbarTransfer(to, new sdk_1.Hbar(amount));
                    if (memo) {
                        transaction.setTransactionMemo(memo);
                    }
                    if (key) {
                        transaction.freezeWith(client);
                        // signing the transaction with the sender key...
                        let signTx = yield transaction.sign(key);
                        // Submitting the transaction to a Hedera network...
                        const txResponse = yield signTx.execute(client);
                        // Requesting the receipt of the transaction...
                        const receipt = yield txResponse.getReceipt(client);
                        // Resolving the transaction consensus status...
                        resolve({
                            status: receipt.status,
                            transaction_id: txResponse.transactionId
                        });
                    }
                    else {
                        // if no key has been provided, we return the transasction to be wrapped
                        // into a scheduled transaction to allow multisig threshold mechanism...          
                        resolve(transaction);
                    }
                }
                catch (error) {
                    reject(error);
                }
            }));
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
    transferToken(tokenId, from, to, amount, tokenDecimals, memo, key, hbarAmount) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const client = this.clientService.getClient();
                    // Creating the transfer transaction...
                    const transaction = yield new sdk_1.TransferTransaction();
                    if (hbarAmount) {
                        transaction
                            .addHbarTransfer(from, new sdk_1.Hbar(-hbarAmount))
                            .addHbarTransfer(to, new sdk_1.Hbar(hbarAmount));
                    }
                    if (!Array.isArray(tokenId) && !Array.isArray(amount) && !Array.isArray(tokenDecimals)) {
                        transaction
                            .addTokenTransfer(tokenId, from, Number(-amount * (10 ** tokenDecimals)))
                            .addTokenTransfer(tokenId, to, Number(amount * (10 ** tokenDecimals)));
                    }
                    else {
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
                        let signTx = yield transaction.sign(key);
                        // Submitting the transaction to a Hedera network...
                        const txResponse = yield signTx.execute(client);
                        // Requesting the receipt of the transaction...
                        const receipt = yield txResponse.getReceipt(client);
                        // Resolving the transaction consensus status...
                        resolve({
                            status: receipt.status,
                            transaction_id: txResponse.transactionId
                        });
                    }
                    else {
                        // if no key has been provided, we return the transasction to be wrapped
                        // into a scheduled transaction to allow multisig threshold mechanism...
                        resolve(transaction);
                    }
                }
                catch (error) {
                    reject(error);
                }
            }));
        });
    }
    /**
     * Atomic Swap
     * @param {Array<any>} swaps
     * @param {string} memo
     * @param {PrivateKey} key
     * @returns {TransactionDetails | Transaction}
     */
    atomicSwap(swaps, memo, key) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const client = this.clientService.getClient();
                    // Creating the transfer transaction...
                    const transaction = yield new sdk_1.TransferTransaction();
                    swaps.forEach(swap => {
                        if (swap.token.id == 'HBAR') {
                            transaction
                                .addHbarTransfer(swap.from, new sdk_1.Hbar(-swap.amount.toFixed(8)))
                                .addHbarTransfer(swap.to, new sdk_1.Hbar(swap.amount.toFixed(8)));
                        }
                        else {
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
                        let signTx = yield transaction.sign(key);
                        // Submitting the transaction to a Hedera network...
                        const txResponse = yield signTx.execute(client);
                        // Requesting the receipt of the transaction...
                        const receipt = yield txResponse.getReceipt(client);
                        // Resolving the transaction consensus status...
                        resolve({
                            status: receipt.status,
                            transaction_id: txResponse.transactionId
                        });
                    }
                    else {
                        // if no key has been provided, we return the transasction to be wrapped
                        // into a scheduled transaction to allow multisig threshold mechanism...
                        resolve(transaction);
                    }
                }
                catch (error) {
                    reject(error);
                }
            }));
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
    transferNftToken(tokenId, from, to, serialNumber, key) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const client = this.clientService.getClient();
                    // Creating the transfer transaction...
                    const transaction = yield new sdk_1.TransferTransaction()
                        .addNftTransfer(new sdk_1.NftId(tokenId, serialNumber), from, to);
                    if (key) {
                        transaction.freezeWith(client);
                        // signing the transaction with the sender key...
                        let signTx = yield transaction.sign(key);
                        // Submitting the transaction to a Hedera network...
                        const txResponse = yield signTx.execute(client);
                        // Requesting the receipt of the transaction...
                        const receipt = yield txResponse.getReceipt(client);
                        // Resolving the transaction consensus status...
                        resolve({
                            status: receipt.status,
                            transaction_id: txResponse.transactionId
                        });
                    }
                    else {
                        // if no key has been provided, we return the transasction to be wrapped
                        // into a scheduled transaction to allow multisig threshold mechanism...
                        resolve(transaction);
                    }
                }
                catch (error) {
                    reject(error);
                }
            }));
        });
    }
};
HtsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [client_service_1.ClientService])
], HtsService);
exports.HtsService = HtsService;
