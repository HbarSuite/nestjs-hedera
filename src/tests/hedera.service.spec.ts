import { Test, TestingModule } from '@nestjs/testing';
import { HederaService } from '../hedera/hedera.service';

describe('HederaService', () => {
  let service: HederaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HederaService],
    }).compile();

    service = module.get<HederaService>(HederaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
