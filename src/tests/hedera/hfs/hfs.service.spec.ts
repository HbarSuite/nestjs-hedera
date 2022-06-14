import { Test, TestingModule } from '@nestjs/testing';
import { HfsService } from '../../../hedera/hfs/hfs.service';
import {
  FileId,
  FileInfo,
  PrivateKey,
  AccountId,
  TopicId,
  TopicMessage,
  Status
} from '@hashgraph/sdk';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '../../../config/configuration';
import { ClientModule } from '../../../hedera/client/client.module';
import { Operator } from '../../../types/operator.types';
import { MirrorNode } from '../../../types/mirror.types';
import { RestModule } from '../../../hedera/rest/rest.module';

const dotenv = require('dotenv');
dotenv.config();

describe('HfsService', () => {
  let service: HfsService;

  let account = {
    id: AccountId.fromString(process.env.DEV_ACCOUNT_ID),
    keys: PrivateKey.fromString(process.env.DEV_ACCOUNT_PRIVATE_KEY),
    memo: "memo"
  };

  let file = {
    id: null
  }

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
      providers: [HfsService],
      exports: [HfsService]
    }).compile();

    service = module.get<HfsService>(HfsService);
  });

  test('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe(`create`, () => {
    test('returns fileId if params are valid, or Hedera does NOT crashes', async () => {
      file.id = await service.create(account.keys, "file content", account.memo, 10);
      expect(file.id).toBeInstanceOf(FileId);
    });

    test('returns error if privateKey is not present', async () => {
      await expect(service.create(null, "file content", account.memo, 10)).rejects.toThrow(Error);
    });
  });

  describe(`append`, () => {
    test('returns status if params are valid, or Hedera does NOT crashes', async () => {
      await expect(service.append(file.id, account.keys, "file content", 10)).resolves.toBeInstanceOf(Status);
    });

    test('returns error if fileId is not present', async () => {
      await expect(service.append(null, account.keys, "file content", 10)).rejects.toThrow(Error);
    });
  });

  describe(`update`, () => {
    test('returns status if params are valid, or Hedera does NOT crashes', async () => {
      await expect(service.update(file.id, "file content", account.keys, account.keys, account.memo, 10)).resolves.toBeInstanceOf(Status);
    });

    test('returns error if fileId is not present', async () => {
      await expect(service.update(null, "file content", account.keys, account.keys, account.memo, 10)).rejects.toThrow(Error);
    });
  });

  describe(`getContents`, () => {
    test('returns Uint8Array if params are valid, or Hedera does NOT crashes', async () => {
      await expect(service.getContents(file.id)).resolves.toBe("file content");
    });

    test('returns error if fileId is not present', async () => {
      await expect(service.getContents(null)).rejects.toThrow(Error);
    });
  });

  describe(`getInfos`, () => {
    test('returns fileInfo if params are valid, or Hedera does NOT crashes', async () => {
      await expect(service.getInfos(file.id)).resolves.toBeInstanceOf(FileInfo);
    });

    test('returns error if fileId is not present', async () => {
      await expect(service.getInfos(null)).rejects.toThrow(Error);
    });
  });

  describe(`delete`, () => {
    test('returns status if params are valid, or Hedera does NOT crashes', async () => {
      await expect(service.delete(file.id, account.keys, 10)).resolves.toBeInstanceOf(Status);
    });

    test('returns error if fileId is not present', async () => {
      await expect(service.delete(null, account.keys, 10)).rejects.toThrow(Error);
    });
  });
});
