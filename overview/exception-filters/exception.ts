// Nest comes with a built-in exceptions layer which is responsible for processing all unhandled exceptions across an application.

/**
 * Out of the box, this action is performed by a built-in global exception filter, which handles exceptions of type HttpException.
 * When an exception is unrecognized, the built-in exception filter generates a 500 response error. 
 */


@Get()
async findAll() {
  throw new HttpException('Forbidden', HttpStatus.FORBIDDEN); //This is a helper enum imported from the @nestjs/common package.
}

/**
 * 
 * The HttpException constructor takes two required arguments which determine the response:
    * The response argument defines the JSON response body. 
    * The status argument defines the HTTP status code.
 * By default, the JSON response body contains two properties:
    * statusCode: defaults to the HTTP status code provided in the status argument
    * message: a short description of the HTTP error based on the status.
 * 
 */


//There is a third constructor argument - options 

//This cause object is not serialized into the response object, but it can be useful for logging purposes. 

@Get()
async findAll() {
  try {
    await this.service.findAll()
  } catch (error) {
    throw new HttpException({
      status: HttpStatus.FORBIDDEN,
      error: 'This is a custom message',
    }, HttpStatus.FORBIDDEN, {
      cause: error
    });
  }
}


/**
 * If you do need to create customized exceptions, it's good practice 
 * to create your own exceptions hierarchy, where your custom exceptions inherit from the base HttpException class.
 */


export class ForbiddenException extends HttpException {
  constructor() {
    super('Forbidden', HttpStatus.FORBIDDEN);
  }
}

//If you want full control over the exceptions layer, you can create an exception filter

/**
 * 
 * To do this, we'll need to access the underlying platform Request and Response objects.
 * We'll access the Request object to pull out the original url and include that in the logging information. 
 * We'll use the Response object to take direct control of the response that is sent.
 * All exception filters should implement the generic ExceptionFilter<T> interface.
 * This requires you to provide the catch(exception: T, host: ArgumentsHost) method with its indicated signature. 
 * T indicates the type of the exception.
 */

import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    .status(status)
    response
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }
}


//================================= Binding filters =================================// 


@Post()
@UseFilters(new HttpExceptionFilter())
async create(@Body() createCatDto: CreateCatDto) {
  throw new ForbiddenException();
}

/**
 * The @UseFilters() decorator can take a single filter instance, or a comma-separated list of filter instances.
 * Here, we created the instance of HttpExceptionFilter in place. You may pass the class (instead of an instance),
 * leaving responsibility for instantiation to the framework, and enabling dependency injection. 
 */

/**
 * Exception filters can be scoped at different levels: method-scoped of the controller/resolver/gateway,
 * controller-scoped, or global-scoped. 
 * For example, to set up a filter as controller-scoped, you would do the following:
 */

@Controller()
@UseFilters(new HttpExceptionFilter())
export class CatsController {}


// To create a global-scoped filter, you would do the following:


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();


/**
 * In terms of dependency injection, global filters registered from outside of any module 
 * cannot inject dependencies since this is done outside the context of any module.
 * You can register a global-scoped filter directly from any module using the following construction:
 */


import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}

/**
 * In order to catch every unhandled exception (regardless of the exception type), 
 * leave the @Catch() decorator's parameter list empty.
 */

//In order to delegate exception processing to the base filter, 
//you need to extend BaseExceptionFilter and call the inherited catch() method.


import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    super.catch(exception, host);
  }
}
