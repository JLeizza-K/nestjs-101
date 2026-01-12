What exactly is happening under the covers to make the Dependency injection of providers work? There are three key steps in the process:

- In the provider's file, the @Injectable() decorator declares the Service class as a class that can be managed by the Nest IoC container.
  The controller declares a dependency on the service token with constructor injection:

```typescript
  constructor(private catsService: CatsService)
```

In app.module.ts, we associate the service's token with the class from the cats.service.ts file.

When the Nest IoC container instantiates the controller, it first looks for any dependencies. When it finds the service dependency, it performs a lookup on its token, which returns the service class, per the registration step. Assuming SINGLETON scope, Nest will then either create an instance of service, cache it, and return it, or if one is already cached, return the existing instance.

One key feature is that dependency analysis (or "creating the dependency graph"), is transitive. If the service itself had dependencies, those too would be resolved.

In a module decorator, usually one declares:

```typescript

@Module({
  controllers: [CatsController],
  providers: [CatsService],
})

```

but the provider's syntaxt its a little more complex:

```typescript
providers: [
  {
    provide: CatsService,
    useClass: CatsService,
  },
];
```

The short-hand notation is merely a convenience to simplify the most common use-case, where the token is used to request an instance of a class by the same name.

### Value providers: useValue

The useValue syntax is useful for injecting a constant value, putting an external library into the Nest container, or replacing a real implementation with a mock object

```typescript
import { CatsService } from "./cats.service";

const mockCatsService = {
  /* mock implementation
  ...
  */
};

@Module({
  imports: [CatsModule],
  providers: [
    {
      provide: CatsService,
      useValue: mockCatsService,
    },
  ],
})
export class AppModule {}
```

In this example, the CatsService token will resolve to the mockCatsService mock object. useValue requires a value - in this case a literal object that has the same interface as the CatsService class it is replacing.

### Non-class-based provider tokens

Sometimes, we may want the flexibility to use strings or symbols as the DI token. For example:

```typescript
import { connection } from "./connection";

@Module({
  providers: [
    {
      provide: "CONNECTION",
      useValue: connection,
    },
  ],
})
export class AppModule {}
```

We are associating a string-valued token ('CONNECTION') with a pre-existing connection object we've imported from an external file.
Let's see how to inject such a provider. To do so, we use the @Inject() decorator. This decorator takes a single argument - the token.

```typescript
@Injectable()
export class CatsRepository {
  constructor(@Inject("CONNECTION") connection: Connection) {}
}
```

### Class providers: useClass

The useClass syntax allows you to dynamically determine a class that a token should resolve to. Depending on the current environment, we want Nest to provide a different implementation of the configuration service. The following code implements such a strategy.

```typescript
const configServiceProvider = {
  provide: ConfigService,
  useClass:
    process.env.NODE_ENV === "development"
      ? DevelopmentConfigService
      : ProductionConfigService,
};

@Module({
  providers: [configServiceProvider],
})
export class AppModule {}
```

For any class that depends on ConfigService, Nest will inject an instance of the provided class (DevelopmentConfigService or ProductionConfigService) overriding any default implementation that may have been declared elsewhere

### Factory providers: useFactory

The useFactory syntax allows for creating providers dynamically. The actual provider will be supplied by the value returned from a factory function.

The factory provider syntax has a pair of related mechanisms:

- The factory function can accept (optional) arguments.
- The (optional) inject property accepts an array of providers that Nest will resolve and pass as arguments to the factory function during the instantiation process. Also, these providers can be marked as optional. The two lists should be correlated: Nest will pass instances from the inject list as arguments to the factory function in the same order.

```typescript
const connectionProvider = {
  provide: "CONNECTION",
  useFactory: (
    optionsProvider: MyOptionsProvider,
    optionalProvider?: string
  ) => {
    const options = optionsProvider.get();
    return new DatabaseConnection(options);
  },
  inject: [
    MyOptionsProvider, // This provider is mandatoru
    { token: "SomeOptionalProvider", optional: true }, // This provider with this token can resolve to 'undefined'
  ],
};

@Module({
  providers: [
    connectionProvider,
    MyOptionsProvider, // class-based provider
    // { provide: 'SomeOptionalProvider', useValue: 'anything' },
  ],
})
export class AppModule {}
```

### Alias providers: useExisting

The useExisting syntax allows you to create aliases for existing providers.

```typescript
@Injectable()
class LoggerService {
  /* implementation details */
}

const loggerAliasProvider = {
  provide: "AliasedLoggerService",
  useExisting: LoggerService,
};

@Module({
  providers: [LoggerService, loggerAliasProvider],
})
export class AppModule {}
```

### Non-service based providers

While providers often supply services, they are not limited to that usage. A provider can supply any value. For example:

```typescript
const configFactory = {
  provide: "CONFIG",
  useFactory: () => {
    return process.env.NODE_ENV === "development" ? devConfig : prodConfig;
  },
};

@Module({
  providers: [configFactory],
})
export class AppModule {}
```

### Export custom provider

To export a custom provider, we can either use its token or the full provider object.

```typescript
const connectionFactory = {
  provide: "CONNECTION",
  useFactory: (optionsProvider: OptionsProvider) => {
    const options = optionsProvider.get();
    return new DatabaseConnection(options);
  },
  inject: [OptionsProvider],
};

@Module({
  providers: [connectionFactory],
  exports: ["CONNECTION"], // This example exports the token
})
export class AppModule {}
```
