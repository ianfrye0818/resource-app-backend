import { Module } from '@nestjs/common';
import { EcolabAssignmentController } from './ecolab-assignment.controller';
import { EcolabAssignmentService } from './ecolab-assignment.service';
import { PrismaService } from 'src/core-services/prisma-service.service';

@Module({
  controllers: [EcolabAssignmentController],
  providers: [EcolabAssignmentService, PrismaService],
  exports: [EcolabAssignmentService],
})
export class EcolabAssignmentModule {}
