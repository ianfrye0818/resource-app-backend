import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { AdminGuard } from 'src/core-guards/admin.guard';
import { PermissionsService } from './permissions.service';
import { CreatePermisssionsDTO } from './dto/create-permissions.dto';

// @UseGuards(JwtGuard, AdminGuard)
@Controller('user/:id/permissions')
export class PermissionsController {
  constructor(private permissionsService: PermissionsService) {}

  @Get()
  async getUserPermissions(@Param('id') id: string) {
    return this.permissionsService.getUserPermissions(id);
  }

  @Patch('add')
  async createPermission(
    @Param('id') id: string,
    @Body() data: CreatePermisssionsDTO,
  ) {
    return this.permissionsService.createPermission(id, data.permissions);
  }

  @Patch('remove')
  async removePermission(
    @Param('id') id: string,
    @Body() data: CreatePermisssionsDTO,
  ) {
    return this.permissionsService.removePermission(id, data.permissions);
  }
}
