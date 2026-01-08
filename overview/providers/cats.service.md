# NestJS Providers - Notas

## ¿Qué es un Provider?

The key idea behind a provider is that it can be injected as a dependency, allowing objects to form various relationships with each other.

This service will handle data storage and retrieval, and it will be used by the CatsController. Because of its role in managing the application's logic, it's an ideal candidate to be defined as a provider.

## Constructor-based Injection

```typescript
import { Injectable } from "@nestjs/common";
import { Cat } from "./interfaces/cat.interface";

@Injectable() // This decorator attaches metadata to the class, signaling that CatsService is a class that can be managed by the Nest IoC container
export class CatsService {
  private readonly cats: Cat[] = [];

  create(cat: Cat) {
    this.cats.push(cat);
  }

  findAll(): Cat[] {
    return this.cats;
  }
}
```

The `@Injectable()` decorator attaches metadata to the class, signaling that `CatsService` is a class that can be managed by the Nest IoC container.

## Optional Dependencies

Your class might depend on a configuration object, but if none is provided, default values should be used. In such cases, the dependency is considered optional, and the absence of the configuration provider should not result in an error.

```typescript
@Injectable()
export class HttpService<T> {
  constructor(@Optional() @Inject("HTTP_OPTIONS") private httpClient: T) {}
}
```

## Property-based Injection

If your top-level class depends on one or more providers, passing them all the way up through `super()` in sub-classes can become cumbersome. To avoid this, you can use the `@Inject()` decorator directly at the property level.

```typescript
@Injectable()
export class HttpService2<T> {
  @Inject("HTTP_OPTIONS")
  private readonly httpClient: T;
}
```

If your class doesn't extend another class, it's generally better to use constructor-based injection.
