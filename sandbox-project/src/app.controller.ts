import {
  Post,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Body,
} from '@nestjs/common';
import { AppService } from './app.service';
import type { User } from './app.service';
import { CreateUserDTO } from './create-user.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':id')
  getUser(@Param('id', ParseIntPipe) id: number): User {
    return this.appService.getUser(id);
  }
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  create(@Body() createUserDTO: CreateUserDTO): User {
    return this.appService.createUser(
      createUserDTO.name,
      createUserDTO.email,
      createUserDTO.password,
    );
  }
}
