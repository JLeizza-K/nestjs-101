import { Test, TestingModule } from '@nestjs/testing';
import { AsadoService } from './asado.service';
import { CookModule } from './cook.module';
import { BarbecueService } from './barbecue.service';

describe('AsadoService', () => {
  let asadoService: AsadoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CookModule],
      providers: [AsadoService, BarbecueService],
    }).compile();

    asadoService = module.get<AsadoService>(AsadoService);
    await asadoService.onModuleInit();
  });

  it('should be defined', () => {
    expect(asadoService).toBeDefined();
  });
  it('should have access to the getMeatForGrill method via ModuleRef.', () => {
    expect(asadoService['barbacueService']).toBeDefined();
  });
  it('should have access to the barbacueService from the asadoService.', () => {
    expect(asadoService['barbacueService']).toBeDefined();

    expect(asadoService['barbacueService']).toBeInstanceOf(BarbecueService);
  });

  it('should have access to the getMeatForGrill method via ModuleRef.', () => {
    const barbacueService = asadoService['barbacueService'];
    const result = barbacueService.getMeatForGrill();
    expect(result).toEqual({ meat: 'asado bandera' });
  });
});
