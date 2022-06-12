import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsRestService } from '../../../hedera/transactions/transactions-rest.service';

describe('TransactionsRestService', () => {
  let service: TransactionsRestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionsRestService],
    }).compile();

    service = module.get<TransactionsRestService>(TransactionsRestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
