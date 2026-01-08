# Custom route decorators

An ES2016 decorator is an expression which returns a function and can take a target, name and property descriptor as arguments. You apply it by prefixing the decorator with an @ character and placing this at the very top of what you are trying to decorate. Decorators can be defined for either a class, a method or a property.

When the behavior of your decorator depends on some conditions, you can use the data parameter to pass an argument to the decorator's factory function.

```
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
```

Here's how you could then access a particular property via the @User() decorator in the controller:

```
@Get()
async findOne(@User('firstName') firstName: string) {
  console.log(`Hello ${firstName}`);
}

## Decorator composition

```

import { applyDecorators } from '@nestjs/common';

export function Auth(...roles: Role[]) {
return applyDecorators(
SetMetadata('roles', roles),
UseGuards(AuthGuard, RolesGuard),
ApiBearerAuth(),
ApiUnauthorizedResponse({ description: 'Unauthorized' }),
);
}

```
The you'd use it this way

```

@Get('users')
@Auth('admin')
findAllUsers() {}

```

```
