import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaService } from './core-services/prisma-service.service';
import { UserModule } from './user/user.module';
import { PermissionsModule } from './permissions/permissions.module';
import { ResumeParserModule } from './resume-parser/resume-parser.module';
import { QrCodeModule } from './qr_code/qr_code.module';
import { EcolabEmployeeModule } from './(ecolab)/ecolab-employee/ecolab-employee.module';
import { EcolabAssignmentModule } from './(ecolab)/ecolab-assignment/ecolab-assignment.module';
import { EcolabManagerModule } from './(ecolab)/ecolab-manager/ecolab-manager.module';
import { AvatarModule } from './avatar/avatar.module';

@Module({
  imports: [
    AuthModule,
    ThrottlerModule.forRoot([
      {
        ttl: 5000,
        limit: 10,
      },
    ]),
    UserModule,
    PermissionsModule,
    ResumeParserModule,
    QrCodeModule,
    EcolabEmployeeModule,
    EcolabAssignmentModule,
    EcolabManagerModule,
    AvatarModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
