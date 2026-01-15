import { forwardRef, Injectable, Inject } from '@nestjs/common';
import { EggService } from './egg.service';

@Injectable()
export class ChickenService { 
constructor(
    @Inject(forwardRef(()=> EggService))
    private eggService : EggService,
){}

}
