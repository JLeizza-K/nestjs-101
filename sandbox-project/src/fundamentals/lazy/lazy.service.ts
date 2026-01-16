import { Injectable } from '@nestjs/common';

@Injectable()
export class LazyService {
  private initTime: number;

  constructor() {
    this.initTime = Date.now(); // Se inicializa cuando se carga el módulo
  }

  init(): number {
    return this.initTime;
  }
}
