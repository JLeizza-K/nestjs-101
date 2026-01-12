import { DynamicModule, Module } from '@nestjs/common';

interface ConfigOptions {
  environment: string;
}

@Module({})
export class ConfigModule {
  static register(options: ConfigOptions): DynamicModule {
    return {
      module: ConfigModule,
      providers: [{ provide: 'CONFIG_OPTIONS', useValue: options }],
    };
  }
}
