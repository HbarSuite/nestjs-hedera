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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientService = void 0;
const common_1 = require("@nestjs/common");
const sdk_1 = require("@hashgraph/sdk");
const event_emitter_1 = require("@nestjs/event-emitter");
/**
 * Injectable
 */
let ClientService = class ClientService {
    /**
     * Hedera Network variables
     * @param {HederaOptions} hederaOptions
     */
    constructor(hederaOptions) {
        this.hederaOptions = hederaOptions;
        /**
         * Logger Service
         */
        this.logger = new common_1.Logger("Client Service");
        this.network = this.hederaOptions.network;
        this.operators = this.hederaOptions.operators;
        // Create our connection to the Hedera network...
        this.client = this.getClient();
        this.operator = this.getNodeOperator();
    }
    /**
     * If the client gives invalid node error...
     * @returns random operator...
     */
    getClient() {
        if (this.network == 'testnet') {
            this.client = sdk_1.Client.forTestnet();
        }
        else {
            this.client = sdk_1.Client.forMainnet();
        }
        this.operator = this.operators[Math.floor(Math.random() * this.operators.length)];
        this.client.setOperator(this.operator.accountId, this.operator.privateKey);
        return this.client;
    }
    /**
     * Gets a node operator
     * @returns {Operator}
     */
    getNodeOperator() {
        return this.operator;
    }
};
__decorate([
    (0, event_emitter_1.OnEvent)('client.invalid_node_operator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", sdk_1.Client)
], ClientService.prototype, "getClient", null);
ClientService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('hederaOptions')),
    __metadata("design:paramtypes", [Object])
], ClientService);
exports.ClientService = ClientService;
