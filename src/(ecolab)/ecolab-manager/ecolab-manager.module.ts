import { Module } from '@nestjs/common';
import { EcolabManagerController } from './ecolab-manager.controller';
import { EcolabManagerService } from './ecolab-manager.service';
import { PrismaService } from 'src/core-services/prisma-service.service';

@Module({
  controllers: [EcolabManagerController],
  providers: [EcolabManagerService, PrismaService],
  exports: [EcolabManagerService],
})
export class EcolabManagerModule {}
