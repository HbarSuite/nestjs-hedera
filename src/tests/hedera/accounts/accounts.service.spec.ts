import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AccountsRestService } from '../../../hedera/accounts/accounts-rest.service';
import { AccountsService } from '../../../hedera/accounts/accounts.service';
import { ClientModule } from '../../../hedera/client/client.module';
import { KeysModule } from '../../../hedera/keys/keys.module';
import { RestModule } from '../../../hedera/rest/rest.module';
import { AccountInfo, PrivateKey, PublicKey, Status, TokenId, AccountId } from '@hashgraph/sdk';
import { AccountDetails } from '../../../types/account_details.types';
import { MirrorNode } from '../../../types/mirror.types';
import { Operator } from '../../../types/operator.types';
import configuration from '../../../config/configuration';

const dotenv = require('dotenv');
dotenv.config();

describe('AccountsService', () => {
  let service: AccountsService;

  let account = {
    id: AccountId.fromString(process.env.DEV_ACCOUNT_ID),
    privateKey: PrivateKey.fromString(process.env.DEV_ACCOUNT_PRIVATE_KEY)
  };

  let token = {
    id: TokenId.fromString(process.env.DEV_TOKEN_ID),
    freezeKey: PrivateKey.fromString(process.env.DEV_TOKEN_FREEZE_KEY)
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration]
        }),
        ClientModule.forRootAsync({
          imports: [ConfigModule],
          useExisting: ConfigService,
          useFactory: async (configService: ConfigService) => ({
            operators: [configService.get<Array<Operator>>(`settings.${configService.get<string>('environment')}.node`)],
            mirrorNode: configService.get<MirrorNode>(`settings.${configService.get<string>('environment')}.mirrorNode`),
            custom: configService.get<MirrorNode>(`settings.${configService.get<string>('environment')}.custom`),
            network: configService.get<string>('environment')
          }),
        }),
        RestModule.forRootAsync({
          imports: [ConfigModule],
          useExisting: ConfigService,
          useFactory: async (configService: ConfigService) => ({
            operators: configService.get<Array<Operator>>(`operators`),
            mirrorNode: configService.get<MirrorNode>(`mirrorNode`),
            network: configService.get<string>('network')
          }),
        }),
        KeysModule
      ],
      providers: [AccountsService, AccountsRestService],
      exports: [AccountsService, AccountsRestService]
    }).compile();

    service = module.get<AccountsService>(AccountsService);
  });

  afterAll(async () => {
    await new Promise(resolve => setTimeout(() => resolve(true), 500));
  });

  test('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe(`getInfo`, () => {
    test('returns AccountInfo if params is valid, or Hedera does NOT crashes', async () => {
      await expect(service.getInfo(account.id)).resolves.toBeInstanceOf(AccountInfo);
    });

    test('returns error if params is not valid, or if Hedera crashes', async () => {
      await expect(service.getInfo(null)).rejects.toThrow(Error);
    });
  });

  describe(`getKeys`, () => {
    test('returns Key if params is valid, or Hedera does NOT crashes', async () => {
      await expect(service.getKeys(account.id)).resolves.toBeInstanceOf(PublicKey);
    });

    test('returns error if params is not valid, or if Hedera crashes', async () => {
      await expect(service.getKeys(null)).rejects.toThrow(Error);
    });
  });

  describe(`updateAccount`, () => {
    test('returns Status if params is valid, or Hedera does NOT crashes', async () => {
      await expect(service.updateAccount(
        account.id,
        account.privateKey,
        account.privateKey,
        'changing memo',
        2
      )).resolves.toBeInstanceOf(Status);
    });

    test('returns error if params is not valid, or if Hedera crashes', async () => {
      await expect(service.updateAccount(
        null,
        account.privateKey,
        account.privateKey,
        'changing memo',
        2
      )).rejects.toThrow(Error);
    });
  });

  describe(`createAccount`, () => {
    test('SINGLE_SIG: returns [accountId, PrivateKey] if params is valid, or Hedera does NOT crashes', async () => {
      await expect(service.createAccount(
        1,
        1,
        null,
        null,
        1
      )).resolves.toBeInstanceOf(AccountDetails)
    });

    test('MULTI_SIG: returns [accountId, PrivateKey] if params is valid, or Hedera does NOT crashes', async () => {
      await expect(service.createAccount(
        1,
        3,
        null,
        2,
        1
      )).resolves.toBeInstanceOf(AccountDetails)
    });

    test('returns error if params is not valid, or if Hedera crashes', async () => {
      await expect(service.createAccount(
        -1,
        1,
        null,
        null,
        1
      )).rejects.toThrow(Error);
    });
  });

  describe(`freezeAccount`, () => {
    test('Returns Status as object, if Hedera does NOT crash', async () => {
      await expect(service.freezeAccount(
        account.id,
        token.id,
        token.freezeKey
      )).resolves.toBeInstanceOf(Object)
    });

    test('returns error if params are not valid, or if Hedera crashes', async () => {
      await expect(service.freezeAccount(
        null,
        token.id,
        token.freezeKey
      )).rejects.toThrow(Error);
    });
  });
  //
  describe(`unfreezeAccount`, () => {
    test('Returns Status as object, if Hedera does NOT crash', async () => {
      await expect(service.unfreezeAccount(
        account.id,
        token.id,
        token.freezeKey
      )).resolves.toBeInstanceOf(Object)
    });

    test('returns error if params are not valid, or if Hedera crashes', async () => {
      await expect(service.unfreezeAccount(
        null,
        token.id,
        token.freezeKey
      )).rejects.toThrow(Error);
    });
  });

  describe(`getQueryBalance`, () => {
    test('Returns AccountBalance as object, if Hedera does NOT crash', async () => {
      await expect(service.getQueryBalance(
        account.id,
        token.id
      )).resolves.toBeInstanceOf(Object)
    });

    test('If there is no token id, map and push', async () => {
      await expect(service.getQueryBalance(
        account.id
      )).resolves.toBeInstanceOf(Object)
    });

    test('Returns error if params are not valid, or if Hedera crashes', async () => {
      await expect(service.getQueryBalance(
        null,
        token.id
      )).rejects.toThrow(Error);
    });
  });
});
