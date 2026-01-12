import {
  MiddlewareConsumer,
  Module,
  RequestMethod,
  NestModule,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './overview/middleware/logger.middleware';

const appServiceAliased = {
  provide: 'aliasAppService',
  useExisting: AppService,
};

@Module({
  imports: [],
  controllers: [AppController],
  //providers: [{ provide: AppService, useClass: AppService }],
  providers: [appServiceAliased],

  exports: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '/academy/*', method: RequestMethod.GET });
  }
}
