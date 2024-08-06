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
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import {
  PermissionsGuard,
  Permissions,
} from 'src/core-guards/permissions.guard';
import { EcolabAssignmentService } from './ecolab-assignment.service';
import {
  CreateEcolabAssignmentDTO,
  UpdateEcolabAssignmentDTO,
} from './dto/create-ecolab-assignment.dto';
import { PermissionList } from '@prisma/client';

@UseGuards(JwtGuard, PermissionsGuard)
@Controller('ecolab-assignment')
export class EcolabAssignmentController {
  constructor(
    private readonly ecolabAssignmentService: EcolabAssignmentService,
  ) {}

  @Permissions(PermissionList.GET_ECOLAB_ASSIGNMENTS)
  @Get()
  async findAll() {
    return await this.ecolabAssignmentService.findAll();
  }

  @Permissions(PermissionList.GET_ECOLAB_ASSIGNMENTS)
  @Get(':beelineId')
  async findByBeelineId(@Param() beelineId: string) {
    return await this.ecolabAssignmentService.findByBeelineId(beelineId);
  }

  @Permissions(PermissionList.CREATE_ECOLAB_ASSIGNEMNTS)
  @Post()
  async createAssignment(@Body() data: CreateEcolabAssignmentDTO) {
    return await this.ecolabAssignmentService.createAssignment(data);
  }

  @Permissions(PermissionList.UPDATE_ECOLAB_ASSIGNMENTS)
  @Patch(':beelineId')
  async updateAssignment(
    @Param() beelineId: string,
    @Body() data: UpdateEcolabAssignmentDTO,
  ) {
    return await this.ecolabAssignmentService.updateAssignment(beelineId, data);
  }

  @Permissions(PermissionList.DELETE_ECOLAB_ASSIGNMENTS)
  @Delete(':beelineId')
  async deleteAssignment(@Param() beelineId: string) {
    return await this.ecolabAssignmentService.deleteAssignment(beelineId);
  }
}
