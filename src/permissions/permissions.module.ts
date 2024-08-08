import { Module } from '@nestjs/common';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/core-services/prisma-service.service';
import { CSVParserService } from 'src/core-services/csv-parser.service';
import { CloudinaryService } from 'src/core-services/cloudinary.service';

@Module({
  controllers: [PermissionsController],
  providers: [
    PermissionsService,
    UserService,
    PrismaService,
    CSVParserService,
    CloudinaryService,
  ],
  exports: [PermissionsService],
})
export class PermissionsModule {}
