import { Test, TestingModule } from '@nestjs/testing';
import { HtsService } from '../../../hedera/hts/hts.service';
import {
  AccountId,
  PrivateKey,
  Status,
  TokenId,
  TransactionReceipt,
  TokenNftInfo,
} from '@hashgraph/sdk';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientModule } from '../../../hedera/client/client.module';
import { RestModule } from '../../../hedera/rest/rest.module';
import { Operator } from '../../../types/operator.types';
import { MirrorNode } from '../../../types/mirror.types';
import { HtsRestService } from '../../../hedera/hts/hts-rest.service';
import configuration from '../../../config/configuration';

const dotenv = require('dotenv');
dotenv.config();

describe('HtsService', () => {
  let service: HtsService;

  let account = {
    id: AccountId.fromString(process.env.DEV_ACCOUNT_ID),
    keys: PrivateKey.fromString(process.env.DEV_ACCOUNT_PRIVATE_KEY),
    memo: "memo"
  };

  let receiver = {
    id: AccountId.fromString(process.env.DEV_OPERATOR_ACCOUNT_ID),
    keys: PrivateKey.fromString(process.env.DEV_OPERATOR_PRIVATE_KEY)
  }

  let token = {
    id: TokenId.fromString(process.env.DEV_TOKEN_ID),
    pauseKey: PrivateKey.fromString(process.env.DEV_TOKEN_PAUSE_KEY),
    swaps: new Array
  };

  let nft = {
    id: TokenId.fromString(process.env.NFT_TOKEN_ID),
    supplyKey: PrivateKey.fromString(process.env.NFT_TOKEN_SUPPLY_KEY),
    cid: process.env.NFT_CID,
    serialNumber: 1
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
            network: configService.get<string>('environment') == 'development' ? 'testnet' : 'mainnet'
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
      providers: [HtsService, HtsRestService],
      exports: [HtsService, HtsRestService]
    }).compile();

    service = module.get<HtsService>(HtsService);
  });

  afterAll(async () => {
    await new Promise(resolve => setTimeout(() => resolve(true), 500));
  });

  test('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe(`associateToken`, () => {
    test('returns Status if params are valid, or Hedera does NOT crashes', async () => {
      await expect(service.associateToken(account.id, token.id, account.keys)).resolves.toBeInstanceOf(Status);
    });

    test('returns error if params are not valid, or if Hedera crashes', async () => {
      await expect(service.associateToken(account.id, null, account.keys)).rejects.toThrow(Error);
    });
  });

  describe(`dissociateToken`, () => {
    test('returns Status if params are valid, or Hedera does NOT crashes', async () => {
      await expect(service.dissociateToken(account.id, token.id, account.keys)).resolves.toBeInstanceOf(Status);
    });

    test('returns error if params are not valid, or if Hedera crashes', async () => {
      await expect(service.associateToken(account.id, null, account.keys)).rejects.toThrow(Error);
    });
  });

  describe(`pauseToken`, () => {
    test('returns Status if params are valid, or Hedera does NOT crashes', async () => {
      await expect(service.pauseToken(token.id, token.pauseKey)).resolves.toBeInstanceOf(Status);
    });

    test('returns error if params are not valid, or if Hedera crashes', async () => {
      await expect(service.pauseToken(null, token.pauseKey)).rejects.toThrow(Error);
    });
  });

  describe(`unpauseToken`, () => {
    test('returns Status if params are valid, or Hedera does NOT crashes', async () => {
      await expect(service.unpauseToken(token.id, token.pauseKey)).resolves.toBeInstanceOf(Status);
    });

    test('returns error if params are not valid, or if Hedera crashes', async () => {
      await expect(service.unpauseToken(null, token.pauseKey)).rejects.toThrow(Error);
    });
  });

  describe(`mintNftToken`, () => {
    test('returns Receipt if params are valid, or Hedera does NOT crashes', async () => {
      await expect(service.mintNftToken(nft.id, nft.supplyKey, nft.cid)).resolves.toBeInstanceOf(TransactionReceipt);
    });

    test('returns error if params are not valid, or if Hedera crashes', async () => {
      await expect(service.mintNftToken(nft.id, nft.supplyKey, null)).rejects.toThrow(Error);
    });
  });

  describe(`burnNftToken`, () => {
    test('returns Receipt if params are valid, or Hedera does NOT crashes', async () => {
      await expect(service.burnNftToken(nft.id, nft.serialNumber, nft.supplyKey)).resolves.toBeInstanceOf(TransactionReceipt);
    });

    test('returns error if params are not valid, or if Hedera crashes', async () => {
      await expect(service.burnNftToken(nft.id, nft.serialNumber, null)).rejects.toThrow(Error);
    });
  });

  describe(`getNftInfo`, () => {
    test('returns Receipt if params are valid, or Hedera does NOT crashes', async () => {
      await expect(service.getNftInfo(nft.id, nft.serialNumber)).resolves.toBeInstanceOf(Array<TokenNftInfo>);
    });

    test('returns error if params are not valid, or if Hedera crashes', async () => {
      await expect(service.getNftInfo(nft.id, null)).rejects.toThrow(Error);
    });
  });

  describe(`transferHbar`, () => {
    test('returns Object if params are valid, or Hedera does NOT crashes', async () => {
      await expect(service.transferHbar(1, account.id, receiver.id, account.memo, account.keys)).resolves.toBeInstanceOf(Object);
    });

    test('returns error if params are not valid, or if Hedera crashes', async () => {
      await expect(service.transferHbar(1, account.id, null, account.memo, account.keys)).rejects.toThrow(Error);
    });
  });

  describe(`transferToken`, () => {
    test('returns transaction details if params are valid, or Hedera does NOT crashes', async () => {
      await expect(service.transferToken(token.id, account.id, receiver.id, 1, 4, account.memo, account.keys, 1)).resolves.toBeInstanceOf(Object);
    });

    test('returns error if params are not valid, or if Hedera crashes', async () => {
      await expect(service.transferToken(token.id, account.id, receiver.id, null, null, account.memo, account.keys, 1)).rejects.toThrow(Error);
    });
  });

  describe(`atomicSwap`, () => {
    test('returns transaction details if params are valid, or Hedera does NOT crashes', async () => {
      await expect(service.atomicSwap(token.swaps, account.memo, account.keys)).resolves.toBeInstanceOf(Object);
    });

    test('returns transaction to wrap into a schedule if params are valid, or Hedera does NOT crashes', async () => {
      await expect(service.atomicSwap(token.swaps, account.memo, null)).resolves.toBeInstanceOf(Object);
    });

    test('returns error if params are not valid, or if Hedera crashes', async () => {
      await expect(service.atomicSwap(null, account.memo, null)).rejects.toThrow(Error);
    });
  });

  describe(`transferNftToken`, () => {
    test('returns transaction details if params are valid, or Hedera does NOT crashes', async () => {
      await expect(service.transferNftToken(nft.id, account.id, receiver.id, 1, account.keys)).resolves.toBeInstanceOf(Object);
    });

    test('returns error if params are not valid, or if Hedera crashes', async () => {
      await expect(service.transferNftToken(nft.id, account.id, receiver.id, 1, account.keys)).rejects.toThrow(Error);
    });
  });
});
