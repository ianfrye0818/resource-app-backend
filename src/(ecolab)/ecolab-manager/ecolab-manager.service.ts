import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/core-services/prisma-service.service';
import { ErrorMessages } from 'src/lib/data';
import {
  CreateEcolabManagerDTO,
  UpdateEcolabManagerDTO,
} from './dto/create-ecolab-manager.dto';

@Injectable()
export class EcolabManagerService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    try {
      await this.prismaService.ecolabManager.findMany();
    } catch (error) {
      console.error(['EcolabManagerService', 'findAll', error]);
      return [];
    }
  }

  async findById(id: string) {
    try {
      await this.prismaService.ecolabManager.findUnique({
        where: { id },
      });
    } catch (error) {
      console.error(['EcolabManagerService', 'findById', error]);
      if (error.code === 'P2025') {
        return new NotFoundException(ErrorMessages.NotFound);
      }
      return new InternalServerErrorException(ErrorMessages.Unknown);
    }
  }

  async create(data: CreateEcolabManagerDTO) {
    try {
      await this.prismaService.ecolabManager.create({
        data,
      });
    } catch (error) {
      console.error(['EcolabManagerService', 'create', error]);
      return new InternalServerErrorException(ErrorMessages.Unknown);
    }
  }

  async update(id: string, data: UpdateEcolabManagerDTO) {
    try {
      await this.prismaService.ecolabManager.update({
        where: { id },
        data,
      });
    } catch (error) {
      console.error(['EcolabManagerService', 'update', error]);
      if (error.code === 'P2025') {
        return new NotFoundException(ErrorMessages.NotFound);
      }
      return new InternalServerErrorException(ErrorMessages.Unknown);
    }
  }

  async delete(id: string) {
    try {
      await this.prismaService.ecolabManager.delete({
        where: { id },
      });
    } catch (error) {
      console.error(['EcolabManagerService', 'delete', error]);
      if (error.code === 'P2025') {
        return new NotFoundException(ErrorMessages.NotFound);
      }
      return new InternalServerErrorException(ErrorMessages.Unknown);
    }
  }
}
