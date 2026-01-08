# NestJS Middleware - Notas

## ¿Qué es Middleware?

Middleware functions have access to the request and response objects, and the `next()` middleware function in the application's request-response cycle.

### Middleware functions can perform the following tasks:

- Execute any code
- Make changes to the request and the response objects
- End the request-response cycle
- Call the next middleware function in the stack
- If the current middleware function does not end the request-response cycle, it must call `next()` to pass control to the next middleware function. Otherwise, the request will be left hanging.

## Implementación

You implement custom Nest middleware in either a function, or in a class with an `@Injectable()` decorator. The class should implement the `NestMiddleware` interface, while the function does not have any special requirements.

### Class Middleware

Simple middleware feature using the class method:

**logger.middleware.ts**

```typescript
import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log("Request...");
    next();
  }
}
```

**app.module.ts**

```typescript
@Module({
  imports: [CatsModule],
})
export class AppModule implements NestModule {
  // Modules that include middleware have to implement the NestModule interface.
  configure(
    consumer: MiddlewareConsumer
  ) //The configure() method can be made asynchronous using async/await.
  {
    consumer
      .apply(LoggerMiddleware) // may either take a single middleware, or multiple arguments to specify multiple middlewares.
      //.apply(cors(), helmet(), logger).forRoutes(CatsController);
      .forRoutes("cats")
      .forRoutes({ path: "cats", method: RequestMethod.GET })
      //In most cases you'll probably just pass a list of controllers separated by commas.
      .forRoutes(CatsController);
  }
}
```

Modules that include middleware have to implement the `NestModule` interface.

The `configure()` method can be made asynchronous using async/await.

The `apply()` method may either take a single middleware, or multiple arguments to specify multiple middlewares.

We may also further restrict a middleware to a particular request method by passing an object containing the route path and request method to the `forRoutes()` method when configuring the middleware.

In most cases you'll probably just pass a list of controllers separated by commas.

## Route Patterns

In the following example, the middleware will be executed for any route that starts with `abcd/`, regardless of the number of characters that follow:

```typescript
forRoutes({
  path: "abcd/*splat",
  method: RequestMethod.ALL,
});
```

However, `abcd/` with no additional characters will not match the route. For this, you need to wrap the wildcard in braces to make it optional:

```typescript
forRoutes({
  path: "abcd/{*splat}",
  method: RequestMethod.ALL,
});
```

## Excluding Routes

```typescript
consumer
  .apply(LoggerMiddleware)
  .exclude(
    { path: "cats", method: RequestMethod.GET },
    { path: "cats", method: RequestMethod.POST },
    "cats/{*splat}"
  )
  .forRoutes(CatsController);
```

With this example, `LoggerMiddleware` will be bound to all routes defined inside `CatsController` except the three passed to the `exclude()` method.

## Functional Middleware

The `LoggerMiddleware` is simple, and it doesn't need to be a class, rather than a function. This type of middleware is called functional middleware.

```typescript
export function logger(req: Request, res: Response, next: NextFunction) {
  console.log(`Request...`);
  next();
}
```

Consider using the simpler functional middleware alternative any time your middleware doesn't need any dependencies.

## Global Middleware

We can use the `use()` method that is supplied by the `INestApplication` instance to bind middleware to every registered route at once.

```typescript
const app = await NestFactory.create(AppModule);
app.use(logger);
await app.listen(process.env.PORT ?? 3000);
```
