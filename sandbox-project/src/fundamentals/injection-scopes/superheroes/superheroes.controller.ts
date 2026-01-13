import { Controller, Get } from '@nestjs/common';
import { SuperheroesService } from './superheroes.service';
import type { Superheroe } from './superheroes.service';

@Controller('superheroes')
export class SuperheroesController {
    constructor(private readonly superheroesService: SuperheroesService){}
    @Get()
    getSuperheroes():Array<Superheroe>{
        return this.superheroesService.getSuperheroes()
    }
}
