import { Test, TestingModule } from '@nestjs/testing';
import { HcsRestService } from '../../../hedera/hcs/hcs-rest.service';

describe('HcsRestService', () => {
  let service: HcsRestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HcsRestService],
    }).compile();

    service = module.get<HcsRestService>(HcsRestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
