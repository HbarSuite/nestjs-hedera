import { Test, TestingModule } from '@nestjs/testing';
import { HcsService } from '../../../hedera/hcs/hcs.service';
import {
  TopicMessage,
  TopicInfo,
  TopicId,
  PrivateKey,
  AccountId,
  Status,
  SubscriptionHandle
} from '@hashgraph/sdk';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientModule } from '../../../hedera/client/client.module';
import configuration from '../../../config/configuration';
import { Operator } from '../../../types/operator.types';
import { MirrorNode } from '../../../types/mirror.types';
import { RestModule } from '../../../hedera/rest/rest.module';

const dotenv = require('dotenv');
dotenv.config();

describe('HcsService', () => {
  let service: HcsService;

  let account = {
    id: AccountId.fromString(process.env.DEV_ACCOUNT_ID),
    keys: PrivateKey.fromString(process.env.DEV_ACCOUNT_PRIVATE_KEY),
    memo: "memo"
  };

  let topic = {
    id: null,
    callback: null
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
        })
      ],
      providers: [HcsService],
      exports: [HcsService]
    }).compile();

    service = module.get<HcsService>(HcsService);
  });

  afterAll(async () => {
    await new Promise(resolve => setTimeout(() => resolve(true), 500));
  });

  test('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe(`createTopic`, () => {
    test('returns TopicId if params are valid, or Hedera does NOT crashes', async () => {
      topic.id = await service.createTopic(account.keys, account.keys, account.memo);
      expect(topic.id).toBeInstanceOf(TopicId);
    });

    test('returns TopicId if params adminKey and submitKey are not present', async () => {
      await expect(service.createTopic(null, null, account.memo)).resolves.toBeInstanceOf(TopicId);
    });

    test('returns TopicId if param submitKey is not present', async () => {
      await expect(service.createTopic(account.keys, null, account.memo)).resolves.toBeInstanceOf(TopicId);
    });

    test('returns TopicId if param adminKey is not present', async () => {
      await expect(service.createTopic(null, account.keys, account.memo)).resolves.toBeInstanceOf(TopicId);
    });

    test('returns TopicId even if no param is present', async () => {
      await expect(service.createTopic(null, null, null)).resolves.toBeInstanceOf(TopicId);
    });
  });

  describe(`updateTopic`, () => {
    test('returns Status if params are valid, or Hedera does NOT crashes', async () => {
      await expect(service.updateTopic(topic.id, account.keys, account.keys, account.keys, account.memo)).resolves.toBeInstanceOf(Status);
    });

    test('returns Status if adminKey is not present', async () => {
      await expect(service.updateTopic(topic.id, account.keys, null, account.keys, account.memo)).resolves.toBeInstanceOf(Status);
    });

    test('returns Status if submitKey is not present', async () => {
      await expect(service.updateTopic(topic.id, account.keys, account.keys, null, account.memo)).resolves.toBeInstanceOf(Status);
    });

    test('returns Status if memo is not present', async () => {
      await expect(service.updateTopic(topic.id, account.keys, account.keys, account.keys, null)).resolves.toBeInstanceOf(Status);
    });

    test('returns error if currentAdminKey is not present', async () => {
      await expect(service.updateTopic(topic.id, null, account.keys, account.keys, account.memo)).rejects.toThrow(Error);
    });
  });

  describe(`topicInfo`, () => {
    test('returns topicInfo if params are valid, or Hedera does NOT crashes', async () => {
      await expect(service.topicInfo(topic.id)).resolves.toBeInstanceOf(TopicInfo);
    });

    test('returns error if topicId is not present', async () => {
      await expect(service.topicInfo(null)).rejects.toThrow(Error);
    });
  });

  describe(`submitMessage`, () => {
    test('returns Status if params are valid, or Hedera does NOT crashes', async () => {
      await expect(service.submitMessage(topic.id, account.memo, account.keys)).resolves.toBe('1');
    });

    test('returns Status if there is no submitKey', async () => {
      await expect(service.submitMessage(topic.id, account.memo, null)).rejects.toThrow(Error);
    });

    test('returns error if topicId is not present', async () => {
      await expect(service.submitMessage(null, account.memo, account.keys)).rejects.toThrow(Error);
    });
  });

  describe(`getMessages`, () => {
    test('returns subscription if params are valid, or Hedera does NOT crashes', async () => {
      await expect(service.getMessages(topic.id, topic.callback, 1, 1, 1)).resolves.toBeInstanceOf(SubscriptionHandle);
    });

    test('returns error if topicId is not present', async () => {
      await expect(service.getMessages(null, topic.callback, 1, 1, 1)).rejects.toThrow(Error);
    });
  });

  describe(`deleteTopic`, () => {
    test('returns Status if params are valid, or Hedera does NOT crashes', async () => {
      await expect(service.deleteTopic(topic.id, account.keys)).resolves.toBeInstanceOf(Status);
    });

    test('returns error if adminKey is not present', async () => {
      await expect(service.deleteTopic(topic.id, null)).rejects.toThrow(Error);
    });
  });
});
