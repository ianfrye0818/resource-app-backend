import { Module } from '@nestjs/common';
import { EcolabManagerController } from './ecolab-manager.controller';
import { EcolabManagerService } from './ecolab-manager.service';

@Module({
  controllers: [EcolabManagerController],
  providers: [EcolabManagerService]
})
export class EcolabManagerModule {}
