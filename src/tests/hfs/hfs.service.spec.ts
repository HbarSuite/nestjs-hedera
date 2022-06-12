import { Test, TestingModule } from '@nestjs/testing';
import { HfsService } from '../../hedera/hfs/hfs.service';

describe('HfsService', () => {
  let service: HfsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HfsService],
    }).compile();

    service = module.get<HfsService>(HfsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
