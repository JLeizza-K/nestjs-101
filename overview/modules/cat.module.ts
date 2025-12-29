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
  export: [CatsService] // Any module that imports the CatsModule has access to the CatsService and will share the same instance with all other modules that import it as well.
})
export class CatsModule {}

/**
 * In Nest, modules are singletons by default, 
 * and thus you can share the same instance of any provider between multiple modules effortlessly.
 */
 

// ================ Module re-exporting ================//


@Module({
  imports: [CommonModule],
  exports: [CommonModule],
})
export class CoreModule {}

/**
 * Modules can re-export modules that they import, making it available for other modules which import this one. 
 */

// ================ Dependency injection ================//

@Module({
  controllers: [CatsController],
  providers: [CatsService],
})

export class CatsModule {
  constructor(private catsService: CatsService) {}
}

//Module classes themselves cannot be injected as providers due to circular dependency .

// ================ Global modules ================//

/**
 * When you want to provide a set of providers which should be available everywhere out-of-the-box 
 * (e.g., helpers, database connections, etc.), make the module global with the @Global() decorator.
 * Global modules should be registered only once, generally by the root or core module.
 * 
 * Making everything global is not recommended as a design practice, 
 * it's generally better to use the imports array to make a module's API available to other modules in a controlled and clear way.
 */

@Global()
@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService],
})
export class CatsModule {}


// ================ Dynamic modules ================//



/**
 * Dynamic modules in Nest allow you to create modules that can be configured at runtime. */

@Module({
  providers: [Connection],
  exports: [Connection],
})
export class DatabaseModule {
  static forRoot(entities = [], options?): DynamicModule {
    const providers = createDatabaseProviders(options, entities);
    return {
      module: DatabaseModule,
      providers: providers,
      exports: providers,
    };
  }
}

/**
 * This module defines the Connection provider by default (in the @Module() decorator metadata), but additionally - depending 
 * on the entities and options objects passed into the forRoot() method - exposes a collection of providers, for example, 
 * repositories. Note that the properties returned by the dynamic module extend (rather than override) the base module metadata 
 * defined in the @Module() decorator.
 */


// The DatabaseModule can be imported and configured in the following manner:

@Module({
  imports: [DatabaseModule.forRoot([User])],
})
export class AppModule {}