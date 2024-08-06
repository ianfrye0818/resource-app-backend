import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/core-services/prisma-service.service';
import { CSVParserService } from 'src/core-services/csv-parser.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, CSVParserService],
  exports: [UserService],
})
export class UserModule {}
