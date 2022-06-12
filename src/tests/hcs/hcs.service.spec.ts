import { Test, TestingModule } from '@nestjs/testing';
import { HcsService } from './hcs.service';

describe('HcsService', () => {
  let service: HcsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HcsService],
    }).compile();

    service = module.get<HcsService>(HcsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
