import { Module } from '@nestjs/common';
import { BarbecueService } from './barbecue.service';
import { AsadoService } from './asado.service';

@Module({
  providers: [BarbecueService, AsadoService],
})
export class CookModule {}
