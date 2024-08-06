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
import { EcolabManagerService } from './ecolab-manager.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import {
  PermissionsGuard,
  Permissions,
} from 'src/core-guards/permissions.guard';
import {
  CreateEcolabManagerDTO,
  UpdateEcolabManagerDTO,
} from './dto/create-ecolab-manager.dto';
import { PermissionList } from '@prisma/client';

@UseGuards(JwtGuard, PermissionsGuard)
@Controller('ecolab-manager')
export class EcolabManagerController {
  constructor(private readonly ecolabManagerService: EcolabManagerService) {}

  @Permissions(PermissionList.GET_ECOLAB_MANAGERS)
  @Get()
  async getAllEcolabManagers() {
    return this.ecolabManagerService.findAll();
  }

  @Permissions(PermissionList.GET_ECOLAB_MANAGERS)
  @Get('id')
  async getEcolabManagerById(@Param('id') id: string) {
    return this.ecolabManagerService.findById(id);
  }

  @Permissions(PermissionList.CREATE_ECOLAB_MANAGERS)
  @Post()
  async createEcolabManager(@Body() data: CreateEcolabManagerDTO) {
    return this.ecolabManagerService.create(data);
  }

  @Permissions(PermissionList.UPDATE_ECOLAB_MANAGERS)
  @Patch(':id')
  async updateEcolabManager(
    @Param('id') id: string,
    @Body() data: UpdateEcolabManagerDTO,
  ) {
    return this.ecolabManagerService.update(id, data);
  }

  @Permissions(PermissionList.DELETE_ECOLAB_MANAGERS)
  @Delete(':id')
  async deleteEcolabManager(@Param('id') id: string) {
    return this.ecolabManagerService.delete(id);
  }
}
