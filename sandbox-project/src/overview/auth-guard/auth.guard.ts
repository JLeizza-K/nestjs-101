import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../roles/roles.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>(Roles, context.getHandler());
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.roles) {
      return false;
    }

    if (!roles) {
      return true;
    }

    return this.matchRoles(roles, user.roles);
  }
  matchRoles(requiredRoles: string[], userRoles: string[]): boolean {
    return requiredRoles.some((role) => userRoles.includes(role));
  }
}
