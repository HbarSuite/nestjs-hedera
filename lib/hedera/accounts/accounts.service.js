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
exports.AccountsService = void 0;
const sdk_1 = require("@hashgraph/sdk");
const common_1 = require("@nestjs/common");
const client_service_1 = require("../client/client.service");
const keys_service_1 = require("../keys/keys.service");
/**
 * Injectable
 */
let AccountsService = class AccountsService {
    /**
     * Constructor
     * @param {ClientService} clientService
     * @param {KeysService} keysService
     */
    constructor(clientService, keysService) {
        this.clientService = clientService;
        this.keysService = keysService;
        /**
        * Logger Service
        */
        this.logger = new common_1.Logger("Accounts Service");
    }
    /**
     * Fetches specific Account Info
     * @param {AccountId} accountId
     * @returns {AccountInfo}
     */
    getInfo(accountId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const client = this.clientService.getClient();
                    // Creating the transaction...
                    const transaction = new sdk_1.AccountInfoQuery()
                        .setAccountId(accountId);
                    // Signing the transaction...
                    const accountInfo = yield transaction.execute(client);
                    // resolving the account's info...
                    resolve(accountInfo);
                }
                catch (error) {
                    reject(error);
                }
            }));
        });
    }
    /**
   * Fetches Specific account public key
   * @param {AccountId} accountId
   * @returns {any} Account Public Key
   */
    getKeys(accountId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const client = this.clientService.getClient();
                    const accountInfo = yield this.getInfo(accountId);
                    resolve(accountInfo.key);
                }
                catch (error) {
                    reject(error);
                }
            }));
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
    updateAccount(accountId, signKey, newKey, memo, maxAutomaticTokenAssociations) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const client = this.clientService.getClient();
                    // Creating the transaction...
                    const transaction = yield new sdk_1.AccountUpdateTransaction()
                        // setting single node accountId, as a workound for offline signature...
                        .setNodeAccountIds([new sdk_1.AccountId(6)])
                        .setAccountId(accountId);
                    if (memo) {
                        transaction.setAccountMemo(memo);
                    }
                    if (maxAutomaticTokenAssociations) {
                        transaction.setMaxAutomaticTokenAssociations(maxAutomaticTokenAssociations);
                    }
                    if (newKey) {
                        transaction.setKey(newKey);
                    }
                    transaction.freezeWith(client);
                    // Signing the transaction...
                    let signTx = yield transaction.sign(signKey);
                    if (newKey) {
                        signTx = yield signTx.sign(newKey);
                    }
                    // Signing the transaction with the client operator...
                    const txResponse = yield signTx.execute(client);
                    // Request the receipt of the transaction...
                    const receipt = yield txResponse.getReceipt(client);
                    // Get the transaction consensus status...
                    resolve(receipt.status);
                }
                catch (error) {
                    reject(error);
                }
            }));
        });
    }
    /**
   * Creates a single or multi-sig account
   * @param {number} balance
   * @param {number} keysLength
   * @param {number} keysThreshold
   * @returns {AccountId, PrivateKey} single or multi-sig account
   */
    createAccount(balance, keysLength, publicKeys, keysThreshold, maxAutomaticTokenAssociations) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const client = this.clientService.getClient();
                    let key = null;
                    if (keysLength > 1) {
                        key = yield this.keysService.generateKeyList(publicKeys, keysLength, keysThreshold);
                    }
                    else {
                        key = yield this.keysService.generateKey();
                    }
                    //Creating the transaction...
                    const transaction = new sdk_1.AccountCreateTransaction()
                        .setKey(keysLength > 1 ? key.keyList : key.publicKey)
                        .setInitialBalance(new sdk_1.Hbar(balance));
                    if (maxAutomaticTokenAssociations) {
                        transaction.setMaxAutomaticTokenAssociations(maxAutomaticTokenAssociations);
                    }
                    // Executing the transactions...
                    const txResponse = yield transaction.execute(client);
                    // Fetching the receipt...
                    const receipt = yield txResponse.getReceipt(client);
                    // resolving the accountId...
                    resolve({
                        accountId: receipt.accountId,
                        key: key
                    });
                }
                catch (error) {
                    reject(error);
                }
            }));
        });
    }
    /**
   * Freezes account related to token ID
   * @param {AccountId} accountId
   * @param {TokenId} tokenId
   * @param {string} freezeKey
   * @returns {Status}
   */
    freezeAccount(accountId, tokenId, freezeKey) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const client = this.clientService.getClient();
                    const transaction = yield new sdk_1.TokenFreezeTransaction()
                        .setAccountId(accountId)
                        .setTokenId(tokenId)
                        .freezeWith(client);
                    const signTx = yield transaction.sign(sdk_1.PrivateKey.fromString(freezeKey));
                    const txResponse = yield signTx.execute(client);
                    const receipt = yield txResponse.getReceipt(client);
                    resolve({
                        status: receipt.status,
                        transaction_id: txResponse.transactionId.toString()
                    });
                }
                catch (error) {
                    reject(error);
                }
            }));
        });
    }
    /**
   * Unfreezes account related to token ID
   * @param {AccountId} accountId
   * @param {TokenId} tokenId
   * @param {string} freezeKey
   * @returns {Status}
   */
    unfreezeAccount(accountId, tokenId, freezeKey) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const client = this.clientService.getClient();
                    const transaction = yield new sdk_1.TokenUnfreezeTransaction()
                        .setAccountId(accountId)
                        .setTokenId(tokenId)
                        .freezeWith(client);
                    const signTx = yield transaction.sign(sdk_1.PrivateKey.fromString(freezeKey));
                    const txResponse = yield signTx.execute(client);
                    const receipt = yield txResponse.getReceipt(client);
                    resolve({
                        status: receipt.status,
                        transaction_id: txResponse.transactionId.toString()
                    });
                }
                catch (error) {
                    reject(error);
                }
            }));
        });
    }
    /**
   * Get query balance
   * @param {string} accountId
   * @param {string} tokenId
   * @returns {AccountBalance}
   */
    getQueryBalance(accountId, tokenId) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            try {
                const client = this.clientService.getClient();
                const query = new sdk_1.AccountBalanceQuery()
                    .setAccountId(accountId);
                const response = yield query.execute(client);
                let balance = null;
                if (tokenId) {
                    balance = {
                        tokens: [{
                                tokenId: tokenId,
                                balance: ((_a = response.tokens) === null || _a === void 0 ? void 0 : _a._map.get(tokenId)) ? Number((_b = response.tokens._map.get(tokenId)) === null || _b === void 0 ? void 0 : _b.toString()) : 0,
                                decimals: ((_c = response.tokens) === null || _c === void 0 ? void 0 : _c._map.get(tokenId)) ? Number((_d = response.tokenDecimals) === null || _d === void 0 ? void 0 : _d._map.get(tokenId)) : 0
                            }],
                        hbars: response.hbars
                    };
                }
                else {
                    let tokens = new Array();
                    (_e = response.tokens) === null || _e === void 0 ? void 0 : _e._map.forEach((value, tokenId) => {
                        var _a, _b, _c, _d;
                        tokens.push({
                            tokenId: tokenId,
                            balance: ((_a = response.tokens) === null || _a === void 0 ? void 0 : _a._map.get(tokenId)) ? Number((_b = response.tokens._map.get(tokenId)) === null || _b === void 0 ? void 0 : _b.toString()) : 0,
                            decimals: ((_c = response.tokens) === null || _c === void 0 ? void 0 : _c._map.get(tokenId)) ? Number((_d = response.tokenDecimals) === null || _d === void 0 ? void 0 : _d._map.get(tokenId)) : 0
                        });
                    });
                    balance = {
                        tokens: tokens,
                        hbars: response.hbars
                    };
                }
                resolve(balance);
            }
            catch (error) {
                reject(error);
            }
        }));
    }
};
AccountsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [client_service_1.ClientService,
        keys_service_1.KeysService])
], AccountsService);
exports.AccountsService = AccountsService;
