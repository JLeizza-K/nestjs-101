# NestJS Interceptors - Notas

## Implementación de un Interceptor

```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log("Before...");

    const now = Date.now();
    return next
      .handle()
      .pipe(tap(() => console.log(`After... ${Date.now() - now}ms`)));
  }
}
```

## Funcionamiento

Each interceptor implements the `intercept()` method, which takes two arguments:

1. **ExecutionContext instance**: By extending `ArgumentsHost`, `ExecutionContext` adds helper methods that provide additional details about the current execution process.
2. **CallHandler**: It implements the `handle()` method, which you can use to invoke the route handler method at some point in your interceptor.

This approach means that the `intercept()` method effectively wraps the request/response stream. As a result, you may implement custom logic both before and after the execution of the final route handler.

## Binding Interceptors

En términos de cómo implementarlos, funcionan de forma similar a las guards: se pueden instanciar directamente como parámetros o por medio de inyección de dependencias. También se puede declarar interceptores globales, con `useGlobalInterceptors` o reescribiendo el provider.

### Global Interceptor con Dependency Injection

```typescript
@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
```

## Casos de Uso

Los interceptors se pueden usar para:

- **Timeouts**: Gestionar tiempos de espera en las peticiones
- **Gestionar tipos de datos de forma global**: En la doc muestra cómo poder reemplazar los nulos por un string vacío, por ejemplo
- **Sobreescribir las excepciones que saltan**: Modificar el comportamiento de las excepciones
