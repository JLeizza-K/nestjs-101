
import { Controller, Get, Post, HttpCode, Header, Redirect, Query, Bind, Param } from '@nestjs/common';


// Using a path prefix in the @Controller() decorator helps us group related routes together and reduces repetitive code. 

@Controller('cats')
export class CatsController {
    @Post()
    // The default status code for responses is 200, except for POST requests, which default to 201. You can change this behavior by using the @HttpCode(...) decorator at the handler level.
    @HttpCode(204)

    // To specify a custom response header, you can either use a @Header() decorator or a library-specific response object (and call res.header() directly).
    @Header('Cache-Control', 'no-store')
    
  create(){
    return 'This action adds a new cat';
  }

  @Get()
  @Redirect('https://nestjs.com', 301)
  // To redirect a response to a specific URL, you can either use a @Redirect() decorator or a library-specific response object
    findAll(/* @Req() request: Request */) {
  // You can access the request object by instructing Nest to inject it using the @Req() decorator in the handler’s signature.
  // We can use the library-specific response object, which can be injected using the @Res() decorator in the method handler signature.
  // With this approach, you have the ability to use the native response handling methods exposed by that object.
    return 'This action returns all cats';
  }

  // When handling query parameters in your routes, you can use the @Query() decorator to extract them from incoming requests.
  @Get()
  async findByAgeAndBreed(@Query('age') age: number, @Query('breed') breed: string) {
    return `This action returns all cats filtered by age: ${age} and breed: ${breed}`;
  }

  // Returned values will override any arguments passed to the @Redirect() decorator.
  @Get('docs')
  @Redirect('https://docs.nestjs.com', 302)
  getDocs(@Query('version') version: string) {
    if (version && version === '5') {
      return { url: 'https://docs.nestjs.com/v5/' };
  }
 }

 // To define routes with parameters, you can add route parameter tokens in the route path to capture the dynamic values from the URL.
 // The route parameter token in the @Get() decorator example below illustrates this approach. These route parameters can then be accessed using the @Param() decorator
  @Get(':id')
  @Bind(Param())
  findOne(params) {
    console.log(params.id);
    return `This action returns a #${params.id} cat`;
  }

 
}

// The @Controller decorator can take a host option to require that the HTTP host of the incoming requests matches some specific value.
@Controller({ host: 'admin.example.com' })
export class AdminController {
  @Get()
  index(): string {
    return 'Admin page';
  }
}


