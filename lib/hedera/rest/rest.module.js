"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var RestModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestModule = void 0;
const common_1 = require("@nestjs/common");
const rest_service_1 = require("./rest.service");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
let RestModule = RestModule_1 = class RestModule {
    static forRoot(options) {
        return {
            module: RestModule_1,
            imports: [axios_1.HttpModule],
            providers: [
                {
                    provide: 'hederaOptions',
                    useValue: options,
                },
                rest_service_1.RestService,
            ],
            exports: [rest_service_1.RestService]
        };
    }
    static forRootAsync(options) {
        return {
            module: RestModule_1,
            imports: [axios_1.HttpModule, config_1.ConfigModule],
            providers: [
                {
                    provide: 'hederaOptions',
                    useFactory: options.useFactory,
                    inject: [options.useExisting]
                },
                rest_service_1.RestService,
            ],
            exports: [rest_service_1.RestService]
        };
    }
};
RestModule = RestModule_1 = __decorate([
    (0, common_1.Module)({})
], RestModule);
exports.RestModule = RestModule;
