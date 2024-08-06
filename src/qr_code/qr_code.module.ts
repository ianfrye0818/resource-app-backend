import { Module } from '@nestjs/common';
import { QrCodeController } from './qr_code.controller';
import { QrCodeService } from './qr_code.service';
import { PrismaService } from 'src/core-services/prisma-service.service';

@Module({
  controllers: [QrCodeController],
  providers: [QrCodeService, PrismaService],
  exports: [QrCodeService],
})
export class QrCodeModule {}
