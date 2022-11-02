import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';

describe('Reports', () => {
  let provider: ReportsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportsService],
    }).compile();

    provider = module.get<ReportsService>(ReportsService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
