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

/**
 * Each interceptor implements the intercept() method, which takes two arguments. The first one is the ExecutionContext instance.
 * By extending ArgumentsHost, ExecutionContext adds helper methods that provide additional details about the current execution process
 * The second argument is a CallHandler it implements the handle() method, which you can use to invoke the route handler
 * method at some point in your interceptor.
 * This approach means that the intercept() method effectively wraps the request/response stream.
 * As a result, you may implement custom logic both before and after the execution of the final route handler.
 */

/**
 * En terminos de como implementarlos, funcionan de forma similar a las guards, se pueden instanciar directamente como parametros o
 * por medio de inyeccion de dependencias. Tambien se puede declarar interceptores globales, con useGlobalInterceptors o reescribiendo
 * el provider.
 *
 * */

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}

/**
 * Los interceptors se puede usar para:
 *  timeouts
 *  gestionar tipos de datos de forma global (en la doc muestra como poder reemplazar los nulos por un string vacio, por ejemplo)
 *  sobreescribir las excepciones que saltan.
 * */
