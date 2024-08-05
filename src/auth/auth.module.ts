import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/core-services/prisma-service.service';
import { env } from '../../env';
import { LocalStrategy } from './strategies/local-strategy';
import { JwtStrategy } from './strategies/jwt-strategy';
import { RefreshStrategy } from './strategies/refresh-strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: env.JWT_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    JwtService,
    PrismaService,
    LocalStrategy,
    JwtStrategy,
    RefreshStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
