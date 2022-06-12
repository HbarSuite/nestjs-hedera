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
exports.RestService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
/**
 * Injectable
 */
let RestService = class RestService {
    /**
     * Rest Transaction Service
     * @param {HederaOptions} hederaOptions
     * @param {HttpService} httpService
     */
    constructor(hederaOptions, httpService) {
        this.hederaOptions = hederaOptions;
        this.httpService = httpService;
        /**
         * Logger Service
         */
        this.logger = new common_1.Logger("Rest Transactions Service");
        this.mirrorNode = this.hederaOptions.mirrorNode;
    }
    /**
     * Call Mirror Node
     * @param {string} endpoint
     * @returns {any}
     */
    call(endpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    let headers = {};
                    if (this.mirrorNode.apiKey) {
                        headers = {
                            'authorization': this.mirrorNode.apiKey
                        };
                    }
                    let response = yield this.httpService
                        .get(`${this.mirrorNode.url}/api/v1/${endpoint}`, { headers: headers }).toPromise();
                    resolve(response === null || response === void 0 ? void 0 : response.data);
                }
                catch (error) {
                    reject(error);
                }
            }));
        });
    }
};
RestService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('hederaOptions')),
    __metadata("design:paramtypes", [Object, axios_1.HttpService])
], RestService);
exports.RestService = RestService;
