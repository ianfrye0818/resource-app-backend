import { Injectable } from '@nestjs/common';
import { PermissionList } from '@prisma/client';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PermissionsService {
  constructor(private readonly userService: UserService) {}

  async getUserPermissions(userId: string) {
    try {
      const user = await this.userService.findOneById(userId);
      return user.permissions;
    } catch (error) {
      console.error(['Error in PermissionsService.getUserPermissions', error]);
      return [];
    }
  }

  async createPermission(userId: string, permissions: PermissionList[]) {
    const user = await this.userService.findOneById(userId);
    return await this.userService.updateUserById(userId, {
      permissions: [...user.permissions, ...permissions],
    });
  }

  async removePermission(id: string, permissions: PermissionList[]) {
    const updatingUser = await this.userService.findOneById(id);
    const newPermissions = updatingUser.permissions.filter(
      (permission) => !permissions.includes(permission),
    );

    return this.userService.updateUserById(id, { permissions: newPermissions });
  }
}
