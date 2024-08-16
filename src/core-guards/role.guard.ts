import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleList } from '@prisma/client';
import { ClientUser } from 'src/lib/types.'; // Adjust path as needed

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.get<RoleList>(
      'role',
      context.getHandler(),
    );
    if (!requiredRole) {
      return true; // No role required for this route
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as ClientUser;

    if (!user.roles.includes(requiredRole)) {
      throw new ForbiddenException('You do not have the required role');
    }
    return true;
  }
}

export const Roles = (role: RoleList) => SetMetadata('role', role);
