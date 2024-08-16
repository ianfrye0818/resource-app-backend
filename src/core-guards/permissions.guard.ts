import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionList } from '@prisma/client';
import { permissionMap } from 'src/lib/constants';
import { ErrorMessages } from 'src/lib/data';
import { ClientUser } from 'src/lib/types.';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<PermissionList[]>(
      'permissions',
      context.getHandler(),
    );
    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as ClientUser;

    const hasPermission = user.roles.some((role) => {
      return permissionMap[role].some((permission) =>
        requiredPermissions.includes(permission),
      );
    });

    if (!hasPermission) {
      throw new ForbiddenException(ErrorMessages.Unauthorized);
    }
    return true;
  }
}

export const Permissions = (...permissions: PermissionList[]) =>
  SetMetadata('permissions', permissions);
