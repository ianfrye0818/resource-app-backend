import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { AdminGuard } from 'src/core-guards/admin.guard';
import { PermissionsService } from './permissions.service';
import { PermissionList } from '@prisma/client';

@UseGuards(JwtGuard, AdminGuard)
@Controller('user/:id/permissions')
export class PermissionsController {
  constructor(private permissionsService: PermissionsService) {}

  @Post('create')
  async createPermission(
    @Param('id') id: string,
    @Body() data: { permissions: PermissionList[] },
  ) {
    return this.permissionsService.createPermission(id, data.permissions);
  }

  @Delete('remove')
  async removePermission(
    @Param('id') id: string,
    @Body() data: { permissions: PermissionList[] },
  ) {
    return this.permissionsService.removePermission(id, data.permissions);
  }
}
