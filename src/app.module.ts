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
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
