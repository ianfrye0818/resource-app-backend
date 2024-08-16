import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleList, PermissionList } from '@prisma/client';
import { permissionMap } from 'src/lib/constants';
import { ClientUser } from 'src/lib/types.';

@Injectable()
export class CombinedGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles =
      this.reflector.get<RoleList[]>('roles', context.getHandler()) || [];
    const requiredPermissions =
      this.reflector.get<PermissionList[]>(
        'permissions',
        context.getHandler(),
      ) || [];

    // No roles or permissions required for this route
    if (requiredRoles.length === 0 && requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as ClientUser;

    // Check for required roles
    if (requiredRoles.length > 0) {
      const hasRole = requiredRoles.some((role) => user.roles.includes(role));
      if (hasRole) {
        return true;
      }
    }

    // Check for required permissions
    if (requiredPermissions.length > 0) {
      const hasPermission = user.roles.some((role) => {
        const rolePermissions = permissionMap[role] || [];
        return requiredPermissions.some((permission) =>
          rolePermissions.includes(permission),
        );
      });

      if (hasPermission) {
        return true;
      }
    }

    // Deny access if no role or permission conditions are met
    throw new ForbiddenException(
      'You do not have the required role or permission',
    );
  }
}

export const Roles = (...roles: RoleList[]) => SetMetadata('roles', roles);
export const Permissions = (...permissions: PermissionList[]) =>
  SetMetadata('permissions', permissions);
