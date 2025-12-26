import { Module } from '@nestjs/common';
import { CatsController } from '../providers/cats.controller.ts';
import { CatsService } from '../providers/cats.controller.ts';

/**
 * A module is a class that is annotated with the @Module() decorator. 
 * This decorator provides metadata that Nest uses to organize and manage the application structure efficiently.
 * The module encapsulates providers by default, meaning you can only inject providers that are either part of the current module 
 * or explicitly exported from other imported modules.
 * The exported providers from a module essentially serve as the module's public interface or API
 */

@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}

/**
 * In Nest, modules are singletons by default, 
 * and thus you can share the same instance of any provider between multiple modules effortlessly.
 */
