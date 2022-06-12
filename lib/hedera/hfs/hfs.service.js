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
exports.HfsService = void 0;
const sdk_1 = require("@hashgraph/sdk");
const common_1 = require("@nestjs/common");
const client_service_1 = require("../client/client.service");
/**
 * Injectable
 */
let HfsService = class HfsService {
    /**
     * HFS Service
     * @param {ClientService} clientService
     */
    constructor(clientService) {
        this.clientService = clientService;
        /**
         * Logger Service
         */
        this.logger = new common_1.Logger("HFS Service");
    }
    /**
     * Create File
     * @param {PrivateKey} key
     * @param {string} content
     * @param {string} memo
     * @param {number} maxTransactionFee
     * @returns {FileId}
     */
    create(key, content, memo, maxTransactionFee) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const client = this.clientService.getClient();
                    // Creating the transaction...
                    const transaction = yield new sdk_1.FileCreateTransaction()
                        .setKeys([key])
                        .setContents(content);
                    if (memo) {
                        transaction.setFileMemo(memo);
                    }
                    if (maxTransactionFee) {
                        transaction.setMaxTransactionFee(new sdk_1.Hbar(maxTransactionFee));
                    }
                    transaction.freezeWith(client);
                    // Signing with the file private keys...
                    const signTx = yield transaction.sign(key);
                    // Executing the transaction...
                    const submitTx = yield signTx.execute(client);
                    // Requesting the receipt...
                    const receipt = yield submitTx.getReceipt(client);
                    // Get the file ID
                    resolve(receipt.fileId);
                }
                catch (error) {
                    reject(error);
                }
            }));
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
    append(fileId, key, content, maxTransactionFee) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const client = this.clientService.getClient();
                    // Creating the transaction...
                    const transaction = yield new sdk_1.FileAppendTransaction()
                        .setFileId(fileId)
                        .setContents(content);
                    if (maxTransactionFee) {
                        transaction.setMaxTransactionFee(new sdk_1.Hbar(maxTransactionFee));
                    }
                    transaction.freezeWith(client);
                    // Signing with the file private keys...
                    const signTx = yield transaction.sign(key);
                    // Executing the transaction...
                    const submitTx = yield signTx.execute(client);
                    // Requesting the receipt...
                    const receipt = yield submitTx.getReceipt(client);
                    // Get the transaction status
                    resolve(receipt.status);
                }
                catch (error) {
                    reject(error);
                }
            }));
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
    update(fileId, content, signKey, newKey, memo, maxTransactionFee) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const client = this.clientService.getClient();
                    // Creating the transaction...
                    const transaction = yield new sdk_1.FileUpdateTransaction()
                        .setFileId(fileId)
                        .setContents(content);
                    if (memo) {
                        transaction.setFileMemo(memo);
                    }
                    if (maxTransactionFee) {
                        transaction.setMaxTransactionFee(new sdk_1.Hbar(maxTransactionFee));
                    }
                    if (newKey) {
                        transaction.setKeys([newKey]);
                    }
                    transaction.freezeWith(client);
                    // Signing the transaction...
                    let signTx = yield transaction.sign(signKey);
                    if (newKey) {
                        signTx = yield signTx.sign(newKey);
                    }
                    // Executing the transaction...
                    const submitTx = yield signTx.execute(client);
                    // Requesting the receipt...
                    const receipt = yield submitTx.getReceipt(client);
                    // Get the transaction status
                    resolve(receipt.status);
                }
                catch (error) {
                    reject(error);
                }
            }));
        });
    }
    /**
     * Delete File
     * @param {FileId} fileId
     * @param {PrivateKey} key
     * @param {number} maxTransactionFee
     * @returns {Status}
     */
    delete(fileId, key, maxTransactionFee) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const client = this.clientService.getClient();
                    // Creating the transaction...
                    const transaction = yield new sdk_1.FileDeleteTransaction()
                        .setFileId(fileId);
                    if (maxTransactionFee) {
                        transaction.setMaxTransactionFee(new sdk_1.Hbar(maxTransactionFee));
                    }
                    transaction.freezeWith(client);
                    // Signing with the file private keys...
                    const signTx = yield transaction.sign(key);
                    // Executing the transaction...
                    const submitTx = yield signTx.execute(client);
                    // Requesting the receipt...
                    const receipt = yield submitTx.getReceipt(client);
                    // Get the transaction status
                    resolve(receipt.status);
                }
                catch (error) {
                    reject(error);
                }
            }));
        });
    }
    /**
     * Get contents
     * @param {FileId} fileId
     * @returns {string}
     */
    getContents(fileId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const client = this.clientService.getClient();
                    // Creating the transaction...
                    const transaction = new sdk_1.FileContentsQuery()
                        .setFileId(fileId);
                    // Signing the transaction...
                    const contents = yield transaction.execute(client);
                    resolve(contents.toString());
                }
                catch (error) {
                    reject(error);
                }
            }));
        });
    }
    /**
     * Get Info
     * @param {FileId} fileId
     * @returns {FileInfo}
     */
    getInfos(fileId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const client = this.clientService.getClient();
                    // Creating the transaction...
                    const transaction = new sdk_1.FileInfoQuery()
                        .setFileId(fileId);
                    // Signing the transaction...
                    const infos = yield transaction.execute(client);
                    resolve(infos);
                }
                catch (error) {
                    reject(error);
                }
            }));
        });
    }
};
HfsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [client_service_1.ClientService])
], HfsService);
exports.HfsService = HfsService;
