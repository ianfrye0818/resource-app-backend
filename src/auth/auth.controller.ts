import { Controller, Request, UseGuards, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';
import { RefreshJwtGuard } from './guards/refresh.guard';
import { Throttle } from '@nestjs/throttler';
// import { createUserDTO } from 'src/user/dto/createUser.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async loginUser(@Request() req) {
    const user = await this.authService.login(req.user);
    return user;
  }

  @Throttle({ default: { limit: 20, ttl: 30 } })
  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refreshToken(@Request() req) {
    const refreshToken = req.headers.authorization.split(' ')[1];
    return await this.authService.refreshToken(req.user, refreshToken);
  }

  // @Post('register')
  // async registerUser(@Body() data: createUserDTO) {
  //   return await this.authService.registerUser(data);
  // }
  s;
  // @Post('logout')
  // async logout(@Request() req) {
  //   const refreshToken = req.headers.authorization.split(' ')[1];
  //   return this.authService.logout(refreshToken);
  // }

  // @Post('reset-password')
  // async updatePassword(@Body() data: { email: string }) {
  //   return await this.authService.sendUpdatePasswordEmail(data);
  // }
}
