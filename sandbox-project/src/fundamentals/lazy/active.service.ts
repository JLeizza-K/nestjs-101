import { Injectable } from '@nestjs/common';

@Injectable()
export class ActiveService {
  private initTime: number;

  constructor() {
    this.initTime = Date.now(); 
  }

  init(): number {
    return this.initTime;
  }
}
