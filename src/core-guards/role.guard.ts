import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleList } from '@prisma/client';
import { ErrorMessages } from 'src/lib/data';
import { ClientUser } from 'src/lib/types.';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<RoleList[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userRoles = (request.user as ClientUser)?.roles || [];

    const hasRole = requiredRoles.every((role) => userRoles.includes(role));
    if (!hasRole) {
      throw new ForbiddenException(ErrorMessages.Unauthorized);
    }
    return true;
  }
}

export const Permissions = (...roles: RoleList[]) =>
  SetMetadata('roles', roles);
