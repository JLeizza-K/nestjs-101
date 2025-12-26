
import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { CatsService } from './cats.service';
import { Cat } from './cat.interface.ts';

@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}
  // The CatsService is injected through the class constructor. Notice the use of the private keyword. 
  // This shorthand allows us to both declare and initialize the catsService member in the same line, streamlining the process.

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }
}
