import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { RoleList } from '@prisma/client';
import { ClientUser } from 'src/lib/types.';

@Injectable()
export class UpdateUserGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const jwtUser = request.user as ClientUser;
    const data = request.body;

    if (jwtUser.roles.includes(RoleList.ADMIN)) {
      return true;
    }

    const userId = request.params.id || request.query.userId;

    if (data.role) {
      throw new ForbiddenException('You cannot update roles');
    }

    // Users can update their own info
    if (jwtUser.userId === userId) {
      return true;
    }

    throw new ForbiddenException('You are not allowed to update this user');
  }
}
