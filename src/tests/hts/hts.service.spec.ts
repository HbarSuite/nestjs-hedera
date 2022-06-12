import { Test, TestingModule } from '@nestjs/testing';
import { HtsService } from './hts.service';

describe('HtsService', () => {
  let service: HtsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HtsService],
    }).compile();

    service = module.get<HtsService>(HtsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
