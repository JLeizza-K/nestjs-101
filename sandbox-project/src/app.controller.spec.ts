import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotFoundException } from './overview/not-found.exception';
import { ValidationPipe } from './overview/validation-pipe';
import { createUserSchema } from './overview/create-user.dto';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('/academy/*', () => {
    it('should return "Hello Academy 2026!"', () => {
      expect(appController.getHello()).toBe('Hello Academy 2026!');
    });
  });

  describe('/filter', () => {
    it('should return the description of the action, using the given parameters', () => {
      expect(appController.filterUsers(28, 'administrator')).toBe(
        `This action returns all users filtered by age: 28 and admin level: administrator`,
      );
      expect(appController.filterUsers(32, 'support')).toBe(
        `This action returns all users filtered by age: 32 and admin level: support`,
      );
    });
  });

  describe(':id', () => {
    it('should return the correct user for the given id', () => {
      expect(appController.getUser(1)).toEqual({
        id: 1,
        name: 'Juan',
        email: 'juan@email.com',
        password: 1234,
      });
    });
    it('should throw and error if the id doesnt exist', () => {
      expect(() => appController.getUser(7364)).toThrow(NotFoundException);
    });
  });

  describe('post user', () => {
    it('should return the created user', () => {
      const createUserDTO = {
        name: 'Jorge',
        email: 'jorge@email.com',
        password: 5566,
      };
      const result = appController.create(createUserDTO);
      expect(result).toEqual({
        id: 5,
        name: 'Jorge',
        email: 'jorge@email.com',
        password: 5566,
      });
    });
    it('should throw an error with invalid DTO types', () => {
      const pipe = new ValidationPipe(createUserSchema);

      const invalidDTO = {
        name: 1233,
        email: 'jorge@email.com',
        password: 'Jorge',
      } as any;

      expect(() => pipe.transform(invalidDTO, { type: 'body' })).toThrow(
        BadRequestException,
      );
    });
  });
});
