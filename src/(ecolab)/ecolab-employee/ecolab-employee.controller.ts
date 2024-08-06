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
import { PermissionList } from '@prisma/client';
import {
  PermissionsGuard,
  Permissions,
} from 'src/core-guards/permissions.guard';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@UseGuards(JwtGuard, PermissionsGuard)
@Controller('ecolab-employee')
export class EcolabEmployeeController {
  constructor(private readonly ecolabEmployeeService: EcolabEmployeeService) {}

  @Permissions(PermissionList.GET_ECOLAB_EMPLOYEES)
  @Get()
  async getAllEcolabEmployees() {
    return this.ecolabEmployeeService.findAll();
  }

  @Permissions(PermissionList.GET_ECOLAB_EMPLOYEES)
  @Get('bullhornId')
  async getEcolabEmployeeById(@Param('bullhornId') bullhornId: string) {
    return this.ecolabEmployeeService.findByBullhornId(bullhornId);
  }

  @Permissions(PermissionList.CREATE_ECOLAB_EMPLOYEES)
  @Post()
  async createEcolabEmployee(@Body() data: CreateEcolabEmployeeDTO) {
    return this.ecolabEmployeeService.create(data);
  }

  @Permissions(PermissionList.UPDATE_ECOLAB_EMPLOYEES)
  @Patch(':bullhornId')
  async updateEcolabEmployee(
    @Param('bullhornId') bullhornId: string,
    @Body() data: UpdateEcolabEmployeeDTO,
  ) {
    return this.ecolabEmployeeService.update(bullhornId, data);
  }

  @Permissions(PermissionList.DELETE_ECOLAB_EMPLOYEES)
  @Delete(':bullhornId')
  async deleteEcolabEmployee(@Param('bullhornId') bullhornId: string) {
    return this.ecolabEmployeeService.delete(bullhornId);
  }
}
