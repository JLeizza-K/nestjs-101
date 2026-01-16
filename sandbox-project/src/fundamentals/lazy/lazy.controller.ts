import { Controller, Get } from '@nestjs/common';
import { LazyService } from './lazy.service';
import { LazyModule } from './lazy.module';
import { LazyModuleLoader } from '@nestjs/core';
import { ActiveService } from './active.service';

@Controller('lazy')
export class LazyController {
  constructor(
    private lazyModule: LazyModuleLoader,
    private activeService: ActiveService,
  ) {}

  @Get('/lazy')
  async getLazyTime() {
    const moduleRef = await this.lazyModule.load(() => LazyModule);
    const lazyService = moduleRef.get(LazyService);

    return { time: lazyService.init() };
  }
  @Get('/active')
  getActiveTime() {
    return { time: this.activeService.init() };
  }
}
