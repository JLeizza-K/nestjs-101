import { Module } from '@nestjs/common';
import { LazyService } from './lazy.service';
import { LazyController } from './lazy.controller';
import { ActiveService } from './active.service';

@Module({
  providers: [LazyService, ActiveService],

  exports: [LazyService],
})
export class LazyModule {}
