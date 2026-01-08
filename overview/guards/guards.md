# NestJS Guards - Notas

## ¿Qué son los Guards?

Guards determine whether a given request will be handled by the route handler or not, depending on certain conditions (like permissions, roles, ACLs, etc.) present at run-time.

Guards have access to the `ExecutionContext` instance, and know what's going to be executed next. They're designed, much like exception filters, pipes, and interceptors, to let you interpose processing logic at exactly the right point in the request/response cycle.

## Implementación de un Guard

```typescript
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    // Every guard must implement a canActivate() function. This function should return a boolean, indicating whether the current request is allowed or not.
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return validateRequest(request);
  }
}
```

Every guard must implement a `canActivate()` function. This function should return a boolean, indicating whether the current request is allowed or not.

## Global Guards

In order to set up a global guard, use the `useGlobalGuards()` method of the Nest application instance:

```typescript
const app = await NestFactory.create(AppModule);
app.useGlobalGuards(new RolesGuard());
```

## Global Guards con Dependency Injection

Global guards registered from outside of any module (with `useGlobalGuards()` as in the example above) cannot inject dependencies. In order to solve this issue, set up a guard directly from any module:

```typescript
@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
```

Where should this be done? Choose the module where the guard (`RolesGuard` in the example above) is defined.
