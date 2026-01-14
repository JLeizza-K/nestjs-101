import { Test, TestingModule } from '@nestjs/testing';
import { SuperheroesController } from './superheroes.controller';
import { SuperheroesService } from './superheroes.service';
import { INestApplication } from '@nestjs/common';
import request from 'supertest'

describe('SuperheroesController', () => {
  let app: INestApplication

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuperheroesController],
      providers : [SuperheroesService]
    }).compile();


    app = module.createNestApplication();
    await app.init()
  });

  afterEach(async ()=> {
    await app.close()
  })

 it('should create a new service for each request', async() => {
  const tracker: number[] = []

  class TrackeableSuperheroesService extends SuperheroesService {
    private instanceId: number;
    constructor(){
      super()
      this.instanceId = Math.random()
      tracker.push(this.instanceId)
  }
}
const module = await Test.createTestingModule({
  controllers: [SuperheroesController],
  providers: [{
    provide: SuperheroesService,
    useClass: TrackeableSuperheroesService
  }]
}).compile()

const testApp = module.createNestApplication()
await testApp.init()

await request(testApp.getHttpServer()).get("/superheroes")
await request(testApp.getHttpServer()).get("/superheroes")
await request(testApp.getHttpServer()).get("/superheroes")

expect(tracker.length).toBe(3)
const uniqueIds = new Set(tracker)
expect(uniqueIds.size).toBe(3)

 })
});
