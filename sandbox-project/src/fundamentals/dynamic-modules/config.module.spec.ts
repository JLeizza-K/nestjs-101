import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from './config.module';

describe('ConfigModule', () => {
  it('should register the module in the right environment', async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.register({ environment: 'development' })],
    }).compile();
    const configOptions = testModule.get('CONFIG_OPTIONS');

    expect(configOptions).toBeDefined();
    expect(configOptions.environment).toBe('development');
  });
});
