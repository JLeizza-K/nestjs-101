import { forwardRef, Injectable, Inject } from '@nestjs/common';
import { ChickenService } from './chicken.service';

@Injectable()
export class EggService { 
constructor(
    @Inject(forwardRef(()=> ChickenService))
    private chickenService : ChickenService,
){}

}
