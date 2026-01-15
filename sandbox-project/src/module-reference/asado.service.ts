import { Injectable } from '@nestjs/common';
import { BarbecueService } from './barbecue.service';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class AsadoService {
  private barbacueService: BarbecueService;
  constructor(private moduleRef: ModuleRef) {}

  async onModuleInit() {
    this.barbacueService = await this.moduleRef.get(BarbecueService);
  }
}
