import { AccountId, PrivateKey } from '@hashgraph/sdk';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import configuration from '../../../config/configuration';
import { ClientModule } from '../../../hedera/client/client.module';
import { KeysService } from '../../../hedera/keys/keys.service';
import { RestModule } from '../../../hedera/rest/rest.module';
import { MirrorNode } from '../../../types/mirror.types';
import { Operator } from '../../../types/operator.types';

const dotenv = require('dotenv');
dotenv.config();

describe('KeysService', () => {
  let service: KeysService;

  let account = {
    id: AccountId.fromString(process.env.DEV_ACCOUNT_ID),
    keys: PrivateKey.fromString(process.env.DEV_ACCOUNT_PRIVATE_KEY),
    memo: "memo",
    publicKey: String["mockKey"]
  };

  let publicKeyList: any = [];

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
        })
      ],
      providers: [KeysService],
      exports: [KeysService]
    }).compile();
    service = module.get<KeysService>(KeysService);
  });

  test('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe(`generateKey`, () => {
    test('returns privateKey if Hedera does NOT crashes', async () => {
      await expect(service.generateKey()).resolves.toBeInstanceOf(PrivateKey);
    });
  });

  describe(`generateKeyList`, () => {
    test('returns keyList if params are valid, or Hedera does NOT crashes', async () => {
      await expect(service.generateKeyList(account.publicKey, 1, 1)).resolves.toBeInstanceOf(Object);
    });

    test('returns keyList if params are valid, or Hedera does NOT crashes', async () => {
      await expect(service.generateKeyList(publicKeyList, 2, 2)).resolves.toBeInstanceOf(Object);
    });

    test('returns empty keyList if no params are present', async () => {
      await expect(service.generateKeyList(null, null, null)).resolves.toBeInstanceOf(Object);
    });
  });
});
