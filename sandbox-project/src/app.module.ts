import {
  MiddlewareConsumer,
  Module,
  RequestMethod,
  NestModule,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './overview/middleware/logger.middleware';
import { ConfigModule } from './fundamentals/dynamic-modules/config.module';
import { EggService } from './circular-dependency/egg.service';
import { ChickenService } from './circular-dependency/chicken.service';

const appServiceAliased = {
  provide: 'aliasAppService',
  useExisting: AppService,
};

@Module({
  imports: [ConfigModule.register({ environment: 'development' })],
  controllers: [AppController],
  providers: [appServiceAliased, EggService, ChickenService],

  exports: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '/academy/*', method: RequestMethod.GET });
  }
}
