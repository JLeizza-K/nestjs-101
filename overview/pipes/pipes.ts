/**
 * A pipe is a class annotated with the @Injectable() decorator, which implements the PipeTransform interface.
 * 
 * Pipes have two typical use cases:
 * 
 *  transformation: transform input data to the desired form (e.g., from string to integer)
 *  validation: evaluate input data and if valid, simply pass it through unchanged; otherwise, throw an exception
 */

@Get(':id')
async findOne(@Param('id', ParseIntPipe) id: number) {
  return this.catsService.findOne(id);
}

/**
 *  This is an example of the transformation use case, where the pipe ensures that a method handler parameter is
 *  converted to a JavaScript integer (or throws an exception if the conversion fails). 
 * 
 *  To use a pipe, we need to bind an instance of the pipe class to the appropriate context.
 *  This example method ensures that one of the following two conditions is true: either the parameter we receive 
 *  in the findOne() method is a number (as expected in our call to this.catsService.findOne()), or an exception is
 *  thrown before the route handler is called
 *  The exception will prevent the body of the findOne() method from executing. 
 */
 
/**
 * As with pipes and guards, we can instead pass an in-place instance.
 * Passing an in-place instance is useful if we want to customize the built-in pipe's behavior by passing options:
 */


@Get(':id')
async findOne(
  @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
  id: number,
) {
  return this.catsService.findOne(id);
}

//============================== Custom Pipes ==============================//


import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class ValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    return value;
  }
}

/**
 * Every pipe must implement the transform() method to fulfill the PipeTransform interface contract.
 * This method has two parameters:
 * The value parameter is the currently processed method argument (before it is received by the route handling method),
 * and metadata is the currently processed method argument's metadata. The metadata object has these properties: 
 */


export interface ArgumentMetadata {
  type: 'body' | 'query' | 'param' | 'custom'; // Indicates whether the argument is a body @Body(), query @Query(), param @Param(), or a custom parameter.
  metatype?: Type<unknown>; // Provides the metatype of the argument, for example, String. Note: the value is undefined if you either omit a type declaration in the route handler method signature, or use vanilla JavaScript.
  data?: string; // The string passed to the decorator, for example @Body('string'). It's undefined if you leave the decorator parenthesis empty.
}
