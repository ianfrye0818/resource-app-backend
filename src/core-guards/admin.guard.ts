import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { ErrorMessages } from 'src/lib/data';
import { ClientUser } from 'src/lib/types.';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const user = request.user as ClientUser;

    if (!user)
      throw new UnauthorizedException(
        'Must be logged in to access this resource',
      );

    if (user.role === Role.ADMIN) return true;

    throw new ForbiddenException(ErrorMessages.Unauthorized);
  }
}
