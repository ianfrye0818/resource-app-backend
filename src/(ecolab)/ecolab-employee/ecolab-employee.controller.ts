import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { EcolabEmployeeService } from './ecolab-employee.service';
import {
  CreateEcolabEmployeeDTO,
  UpdateEcolabEmployeeDTO,
} from './dto/create-ecolab-employee.dto';
import { PermissionList, RoleList } from '@prisma/client';
import { Permissions } from 'src/core-guards/permissions.guard';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CombinedGuard } from 'src/core-guards/role-permission-combined.guard';
import { Roles } from 'src/core-guards/role.guard';

@UseGuards(JwtGuard, CombinedGuard)
@Controller('ecolab-employee')
export class EcolabEmployeeController {
  constructor(private readonly ecolabEmployeeService: EcolabEmployeeService) {}

  @Roles(RoleList.ECOLAB)
  @Permissions(PermissionList.GET_ECOLAB_EMPLOYEES)
  @Get()
  async getAllEcolabEmployees() {
    return this.ecolabEmployeeService.findAll();
  }

  @Roles(RoleList.ECOLAB)
  @Permissions(PermissionList.GET_ECOLAB_EMPLOYEES)
  @Get('bullhornId')
  async getEcolabEmployeeById(@Param('bullhornId') bullhornId: string) {
    return this.ecolabEmployeeService.findByBullhornId(bullhornId);
  }

  @Roles(RoleList.ECOLAB)
  @Permissions(PermissionList.CREATE_ECOLAB_EMPLOYEES)
  @Post()
  async createEcolabEmployee(@Body() data: CreateEcolabEmployeeDTO) {
    return this.ecolabEmployeeService.create(data);
  }

  @Roles(RoleList.ECOLAB)
  @Permissions(PermissionList.UPDATE_ECOLAB_EMPLOYEES)
  @Patch(':bullhornId')
  async updateEcolabEmployee(
    @Param('bullhornId') bullhornId: string,
    @Body() data: UpdateEcolabEmployeeDTO,
  ) {
    return this.ecolabEmployeeService.update(bullhornId, data);
  }

  @Roles(RoleList.ECOLAB)
  @Permissions(PermissionList.DELETE_ECOLAB_EMPLOYEES)
  @Delete(':bullhornId')
  async deleteEcolabEmployee(@Param('bullhornId') bullhornId: string) {
    return this.ecolabEmployeeService.delete(bullhornId);
  }
}
