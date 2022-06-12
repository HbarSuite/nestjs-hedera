import { Test, TestingModule } from '@nestjs/testing';
import { HtsRestService } from '../../../hedera/hts/hts-rest.service';

describe('HtsRestService', () => {
  let service: HtsRestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HtsRestService],
    }).compile();

    service = module.get<HtsRestService>(HtsRestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
