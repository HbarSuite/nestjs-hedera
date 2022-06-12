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
exports.KeysService = void 0;
const common_1 = require("@nestjs/common");
const sdk_1 = require("@hashgraph/sdk");
/**
 * Injectable
 */
let KeysService = class KeysService {
    /**
     * KeyService class
     */
    constructor() {
        /**
         * Logger Service
         */
        this.logger = new common_1.Logger("Keys Service");
    }
    /**
     * Generate Private Key
     * @returns {PrivateKey}
     */
    generateKey() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const key = yield sdk_1.PrivateKey.generate();
                resolve(key);
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    /**
     * Generate a list of Keys
     * @param {string} publicKeys
     * @param {number} length
     * @param {number} threshold
     * @returns {PrivateKeyList}
     */
    generateKeyList(publicKeys, length, threshold) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let publicKeyList = [];
                // if an array of keys is provided, we use it...
                if (publicKeys) {
                    publicKeys.forEach(key => {
                        publicKeyList.push(sdk_1.PublicKey.fromString(key));
                    });
                    resolve({
                        privateKeys: [],
                        keyList: new sdk_1.KeyList(publicKeyList, threshold ? threshold : null)
                    });
                }
                // otherwise, we generate the keys we need...
                else {
                    let privateKeys = [];
                    if (length) {
                        [...Array(length).keys()].forEach(() => {
                            let key = sdk_1.PrivateKey.generate();
                            privateKeys.push(key);
                            publicKeyList.push(key.publicKey);
                        });
                        resolve({
                            privateKeys: privateKeys,
                            keyList: new sdk_1.KeyList(publicKeyList, threshold ? threshold : null)
                        });
                    }
                    else {
                        resolve({
                            privateKeys: [],
                            keyList: new sdk_1.KeyList([])
                        });
                    }
                }
            }
            catch (error) {
                reject(error);
            }
        }));
    }
};
KeysService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], KeysService);
exports.KeysService = KeysService;
