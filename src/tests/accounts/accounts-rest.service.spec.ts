import { Test, TestingModule } from '@nestjs/testing';
import { AccountsRestService } from '../../../hedera/accounts/accounts-rest.service';

describe('AccountsRestService', () => {
  let service: AccountsRestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountsRestService],
    }).compile();

    service = module.get<AccountsRestService>(AccountsRestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
