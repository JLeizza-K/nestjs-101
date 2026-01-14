import { Test, TestingModule } from '@nestjs/testing';
import { ChickenService } from './chicken.service';
import { EggService } from './egg.service';

describe('ChickenService and EggService circular dependency', () => {
  let chickenService: ChickenService;
  let eggService: EggService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChickenService, EggService],
    }).compile();

    eggService = module.get<EggService>(EggService);
    chickenService = module.get<ChickenService>(ChickenService);
  });

  it('circular dependency is properly resolved', () => {
    expect(chickenService['eggService']).toBe(eggService);
    expect(eggService['chickenService']).toBe(chickenService);
  });
});
