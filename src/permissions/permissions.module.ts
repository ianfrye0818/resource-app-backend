import { Module } from '@nestjs/common';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/core-services/prisma-service.service';
import { CSVParserService } from 'src/core-services/csv-parser.service';

@Module({
  controllers: [PermissionsController],
  providers: [PermissionsService, UserService, PrismaService, CSVParserService],
  exports: [PermissionsService],
})
export class PermissionsModule {}
