import {
  Post,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Body,
  Query,
  HttpCode,
  UsePipes,
} from '@nestjs/common';
import { AppService } from './app.service';
import type { User } from './app.service';
import { createUserSchema } from './create-user.dto';
import type { CreateUserDTO } from './create-user.dto';
import { ValidationPipe } from './validation-pipe';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/academy/*')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/filter')
  filterUsers(@Query('age') age: number, @Query('level') level: string) {
    return `This action returns all users filtered by age: ${age} and admin level: ${level}`;
  }
  ///age=28&level=administrator

  @Get(':id')
  getUser(@Param('id', ParseIntPipe) id: number): User {
    return this.appService.getUser(id);
  }

  @Get()
  getUsers(): Array<User> {
    return this.appService.getUsers();
  }

  @Post()
  @HttpCode(204)
  @UsePipes(new ValidationPipe(createUserSchema))
  create(@Body() createUserDTO: CreateUserDTO): User {
    return this.appService.createUser(createUserDTO);
  }
}
