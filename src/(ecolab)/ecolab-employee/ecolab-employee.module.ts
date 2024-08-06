import { Module } from '@nestjs/common';
import { EcolabEmployeeController } from './ecolab-employee.controller';
import { EcolabEmployeeService } from './ecolab-employee.service';
import { PrismaService } from 'src/core-services/prisma-service.service';

@Module({
  controllers: [EcolabEmployeeController],
  providers: [EcolabEmployeeService, PrismaService],
  exports: [EcolabEmployeeService],
})
export class EcolabEmployeeModule {}
