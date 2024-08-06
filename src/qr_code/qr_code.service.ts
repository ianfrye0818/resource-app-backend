import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/core-services/prisma-service.service';
import { ErrorMessages } from 'src/lib/data';
import { CreateQRCodeDTO } from './dto/create-qr-code.dto';

@Injectable()
export class QrCodeService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllCodes(userId: string) {
    try {
      return await this.prismaService.qR_Codes.findMany({
        where: {
          userId,
        },
      });
    } catch (error) {
      console.error(['getAllCodes'], error);
      if (error.code === 'P2025') {
        throw new Error('No codes found');
      }
      throw new InternalServerErrorException(ErrorMessages.Unknown);
    }
  }

  async getCodeById(id: string, userId: string) {
    try {
      const code = await this.prismaService.qR_Codes.findUnique({
        where: {
          id,
        },
      });

      if (code.userId !== userId) {
        throw new UnauthorizedException(ErrorMessages.Unauthorized);
      }
      return code;
    } catch (error) {
      console.error(['getCodeById'], error);
      if (error.code === 'P2025') {
        throw new Error('Code not found');
      }
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException(ErrorMessages.Unknown);
    }
  }

  async createCode(userId: string, data: CreateQRCodeDTO) {
    try {
      return await this.prismaService.qR_Codes.create({
        data: {
          userId,
          ...data,
        },
      });
    } catch (error) {
      console.error(['createCode'], error);
      throw new InternalServerErrorException(ErrorMessages.Unknown);
    }
  }

  async deleteCode(id: string, userId: string) {
    try {
      const code = await this.prismaService.qR_Codes.findUnique({
        where: {
          id,
        },
      });

      if (code.userId !== userId) {
        throw new UnauthorizedException(ErrorMessages.Unauthorized);
      }

      await this.prismaService.qR_Codes.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      console.error(['deleteCode'], error);
      if (error.code === 'P2025') {
        throw new Error('Code not found');
      }
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException(ErrorMessages.Unknown);
    }
  }
}
