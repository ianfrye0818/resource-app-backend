import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/core-services/prisma-service.service';
import {
  CreateEcolabEmployeeDTO,
  UpdateEcolabEmployeeDTO,
} from './dto/create-ecolab-employee.dto';
import { ErrorMessages } from 'src/lib/data';

@Injectable()
export class EcolabEmployeeService {
  constructor(private prismaService: PrismaService) {}

  async findAll() {
    try {
      return await this.prismaService.ecolabEmployee.findMany();
    } catch (error) {
      console.error(['EcolabEmployeeService', 'findAll', error]);
      return [];
    }
  }

  async findByBullhornId(bullhornId: string) {
    try {
      return await this.prismaService.ecolabEmployee.findUnique({
        where: { bullhornId },
      });
    } catch (error) {
      console.error(['EcolabEmployeeService', 'findByBullhornId', error]);
      if (error.code === 'P2025') {
        throw new NotFoundException(ErrorMessages.NotFound);
      }
      throw new InternalServerErrorException(ErrorMessages.Unknown);
    }
  }

  async create(data: CreateEcolabEmployeeDTO) {
    try {
      return await this.prismaService.ecolabEmployee.create({
        data,

        include: { assignments: true },
      });
    } catch (error) {
      console.error(['EcolabEmployeeService', 'create', error]);
      if (error.code === 'P2002' || error.code === 'P2020') {
        throw new ConflictException(ErrorMessages.Duplicate);
      }
      throw new InternalServerErrorException(ErrorMessages.Unknown);
    }
  }

  async update(bullhornId: string, data: UpdateEcolabEmployeeDTO) {
    try {
      return await this.prismaService.ecolabEmployee.update({
        where: { bullhornId },
        data,
      });
    } catch (error) {
      console.error(['EcolabEmployeeService', 'update', error]);
      if (error.code === 'P2025') {
        throw new NotFoundException(ErrorMessages.NotFound);
      }
      throw new InternalServerErrorException(ErrorMessages.Unknown);
    }
  }

  async delete(bullhornId: string) {
    try {
      return await this.prismaService.ecolabEmployee.delete({
        where: { bullhornId },
      });
    } catch (error) {
      console.error(['EcolabEmployeeService', 'delete', error]);
      if (error.code === 'P2025') {
        throw new NotFoundException(ErrorMessages.NotFound);
      }
      throw new InternalServerErrorException(ErrorMessages.Unknown);
    }
  }
}
