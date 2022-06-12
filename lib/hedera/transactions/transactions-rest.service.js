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
exports.TransactionsRestService = void 0;
const common_1 = require("@nestjs/common");
const rest_service_1 = require("../rest/rest.service");
/**
 * Injectable
 */
let TransactionsRestService = class TransactionsRestService {
    /**
     * Transaction Rest Service
     * @param {RestService} restService
     */
    constructor(restService) {
        this.restService = restService;
    }
    /**
     * Fetch all transactions from timestamp
     * @param {string} timestamp
     * @param {string} accountId
     * @returns {any} response
     */
    getAllTransactionsFromTimestamp(timestamp, accountId) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let transactions = [];
                let response = yield this.restService
                    .call(`transactions/?account.id=${accountId}&timestamp=gt:${timestamp}`);
                transactions = transactions.concat(response.transactions);
                while (response.links.next) {
                    let nextArray = response.links.next.split("&");
                    let next = nextArray.slice(1, nextArray.length).join('&');
                    yield new Promise(resolve => setTimeout(resolve, 1000));
                    response = yield this.restService
                        .call(`transactions/?account.id=${accountId}&${next}`);
                    transactions = transactions.concat(response.transactions);
                }
                resolve(transactions);
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    /**
     * Fetch all transactions
     * @param {string} accountId
     * @param {string} filters
     * @returns {any} response
     */
    getAllTransactions(accountId, filters) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let transactions = [];
                let url = `transactions/?account.id=${accountId}`;
                if (filters) {
                    url += `&${filters}`;
                }
                let response = yield this.restService
                    .call(url);
                transactions = transactions.concat(response.transactions);
                while (response.links.next) {
                    let nextArray = response.links.next.split("&");
                    let next = nextArray.slice(1, nextArray.length).join('&');
                    yield new Promise(resolve => setTimeout(resolve, 1000));
                    response = yield this.restService
                        .call(`transactions/?account.id=${accountId}&${next}`);
                    transactions = transactions.concat(response.transactions);
                }
                resolve(transactions);
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    /**
     * Fetch transaction by timestamp
     * @param {string} timestamp
     * @returns {any} response
     */
    getTransactionByTimestamp(timestamp) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let response = yield this.restService
                    .call(`transactions/?timestamp=${timestamp}`);
                resolve(response.transactions);
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    /**
     * Fetch transaction by id
     * @param {string} transaction_id
     * @returns {any} response
     */
    getTransactionById(transaction_id) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let response = yield this.restService
                    .call(`transactions/${transaction_id}`);
                resolve(response.transactions);
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    /**
     * Fetch latest transactions
     * @param {string} accountId
     * @returns {any} response
     */
    getLatestTransactions(accountId) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let response = yield this.restService
                    .call(`transactions/?account.id=${accountId}`);
                resolve(response);
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    /**
     * Fetch scheduled transaction
     * @param {string} transactionId
     * @returns {any} response
     */
    getScheduledTransaction(transactionId) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let response = yield this.restService
                    .call(`schedules/${transactionId}`);
                resolve(response);
            }
            catch (error) {
                reject(error);
            }
        }));
    }
};
TransactionsRestService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [rest_service_1.RestService])
], TransactionsRestService);
exports.TransactionsRestService = TransactionsRestService;
