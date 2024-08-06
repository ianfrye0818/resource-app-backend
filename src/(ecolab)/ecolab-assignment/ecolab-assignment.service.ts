import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/core-services/prisma-service.service';
import { ErrorMessages } from 'src/lib/data';
import {
  CreateEcolabAssignmentDTO,
  UpdateEcolabAssignmentDTO,
} from './dto/create-ecolab-assignment.dto';

@Injectable()
export class EcolabAssignmentService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    try {
      return await this.prismaService.ecolabAssignments.findMany();
    } catch (error) {
      console.error(['Error in EcolabAssignmentService.findAll', error]);
      return [];
    }
  }

  async findByBeelineId(beelineId: string) {
    try {
      return await this.prismaService.ecolabAssignments.findUnique({
        where: {
          beelineRequestId: beelineId,
        },
      });
    } catch (error) {
      console.error([
        'Error in EcolabAssignmentService.findByBeelineId',
        error,
      ]);
      if (error.code === 'P2025') {
        return new NotFoundException(ErrorMessages.NotFound);
      }
      return new InternalServerErrorException(ErrorMessages.Unknown);
    }
  }

  async createAssignment(data: CreateEcolabAssignmentDTO) {
    try {
      return await this.prismaService.ecolabAssignments.create({
        data,
      });
    } catch (error) {
      console.error([
        'Error in EcolabAssignmentService.createAssignment',
        error,
      ]);
      return new InternalServerErrorException(ErrorMessages.Unknown);
    }
  }

  async updateAssignment(beelineId: string, data: UpdateEcolabAssignmentDTO) {
    try {
      return await this.prismaService.ecolabAssignments.update({
        where: {
          beelineRequestId: beelineId,
        },
        data,
      });
    } catch (error) {
      console.error([
        'Error in EcolabAssignmentService.updateAssignment',
        error,
      ]);
      if (error.code === 'P2025') {
        return new NotFoundException(ErrorMessages.NotFound);
      }

      return new InternalServerErrorException(ErrorMessages.Unknown);
    }
  }

  async deleteAssignment(beelineId: string) {
    try {
      return await this.prismaService.ecolabAssignments.delete({
        where: {
          beelineRequestId: beelineId,
        },
      });
    } catch (error) {
      console.error([
        'Error in EcolabAssignmentService.deleteAssignment',
        error,
      ]);
      if (error.code === 'P2025') {
        return new NotFoundException(ErrorMessages.NotFound);
      }

      return new InternalServerErrorException(ErrorMessages.Unknown);
    }
  }
}
