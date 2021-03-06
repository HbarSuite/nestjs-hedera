"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var HederaModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HederaModule = void 0;
const common_1 = require("@nestjs/common");
const hedera_service_1 = require("./hedera.service");
const keys_module_1 = require("./keys/keys.module");
const transactions_module_1 = require("./transactions/transactions.module");
const client_module_1 = require("./client/client.module");
const rest_module_1 = require("./rest/rest.module");
const hcs_module_1 = require("./hcs/hcs.module");
const hfs_module_1 = require("./hfs/hfs.module");
const hts_module_1 = require("./hts/hts.module");
const accounts_module_1 = require("./accounts/accounts.module");
let HederaModule = HederaModule_1 = class HederaModule {
    static forRoot(options) {
        return {
            module: HederaModule_1,
            imports: [
                keys_module_1.KeysModule,
                client_module_1.ClientModule.forRoot(options),
                rest_module_1.RestModule.forRoot(options),
                transactions_module_1.TransactionsModule,
                hcs_module_1.HcsModule,
                hfs_module_1.HfsModule,
                hts_module_1.HtsModule,
                accounts_module_1.AccountsModule
            ],
            providers: [hedera_service_1.HederaService],
            exports: [
                hedera_service_1.HederaService,
                keys_module_1.KeysModule,
                client_module_1.ClientModule.forRoot(options),
                rest_module_1.RestModule.forRoot(options),
                transactions_module_1.TransactionsModule,
                hcs_module_1.HcsModule,
                hfs_module_1.HfsModule,
                hts_module_1.HtsModule,
                accounts_module_1.AccountsModule
            ],
            global: true
        };
    }
    static forRootAsync(options) {
        return {
            module: HederaModule_1,
            imports: [
                keys_module_1.KeysModule,
                client_module_1.ClientModule.forRootAsync(options),
                rest_module_1.RestModule.forRootAsync(options),
                transactions_module_1.TransactionsModule,
                hcs_module_1.HcsModule,
                hfs_module_1.HfsModule,
                hts_module_1.HtsModule,
                accounts_module_1.AccountsModule
            ],
            providers: [hedera_service_1.HederaService],
            exports: [
                hedera_service_1.HederaService,
                keys_module_1.KeysModule,
                client_module_1.ClientModule.forRootAsync(options),
                rest_module_1.RestModule.forRootAsync(options),
                transactions_module_1.TransactionsModule,
                hcs_module_1.HcsModule,
                hfs_module_1.HfsModule,
                hts_module_1.HtsModule,
                accounts_module_1.AccountsModule
            ],
            global: true
        };
    }
};
HederaModule = HederaModule_1 = __decorate([
    (0, common_1.Module)({})
], HederaModule);
exports.HederaModule = HederaModule;
