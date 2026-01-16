import { Test, TestingModule } from '@nestjs/testing';
import { LazyController } from './lazy.controller';
import { ActiveService } from './active.service';
import { LazyModuleLoader } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

describe('LazyController', () => {
  let controller: LazyController;
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LazyController],
      providers: [ActiveService],
    }).compile();

    controller = module.get<LazyController>(LazyController);
    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should have a bigger init time than the lazy module', async () => {
    const activeResponse = await request(app.getHttpServer()).get(
      '/lazy/active',
    );
    const activeTime = activeResponse.body.time;

    await new Promise((resolve) => setTimeout(resolve, 10)); // solo es un timer para dejar tiempo entre uno y otro

    const lazyResponse = await request(app.getHttpServer()).get('/lazy/lazy');

    const lazyTime = lazyResponse.body.time;

    expect(activeTime).toBeDefined();
    expect(lazyTime).toBeDefined();

    expect(lazyTime).toBeGreaterThan(activeTime);
  });
});
