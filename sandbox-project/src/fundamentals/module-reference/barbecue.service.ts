import { Injectable } from '@nestjs/common';

@Injectable()
export class BarbecueService {

  getMeatForGrill() {
    return { meat: 'asado bandera' };
  }
}
