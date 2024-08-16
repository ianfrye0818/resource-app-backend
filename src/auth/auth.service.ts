import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { env } from '../../env';

// import { Role } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import { ClientUser } from 'src/lib/types.';
import { generateClientSideUserProperties } from 'src/lib/utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,

    // private userNotificaitonService: UserNotificationsService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<ClientUser | null> {
    const user = await this.userService.findOneByEmail(email.toLowerCase());

    //make sure user is not deleted
    if (user && user.deletedAt !== null)
      throw new HttpException(
        'Your account has been deleted! See admin for access.',
        404,
      );

    //make sure user is verified
    if (user && user.isActive === false)
      throw new UnauthorizedException(
        'Your account has been deactivated. Contact admin for access',
      );

    //create client side user properties and return
    if (user && (await bcrypt.compare(password, user.password))) {
      return generateClientSideUserProperties(user);
    }
  }

  // async logout(token: string): Promise<void> {
  //   return await this.refreshTokenService.deleteToken(token);
  // }

  async login(payload: ClientUser) {
    // await this.refreshTokenService.updateUserRefreshToken({
    //   newToken: refreshToken,
    //   userId: payload.userId,
    // });

    const refreshToken = this.generateRefreshToken(payload);
    const accessToken = this.generateAccessToken(payload);

    return {
      ...payload,
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(user: ClientUser, oldToken: string) {
    try {
      // await this.refreshTokenService.getRefreshToken(oldToken);

      // const cachedToken = this.refreshTokenService.getCachedToken(oldToken);
      // if (cachedToken) {
      //   const accessToken = this.generateAccessToken(user);
      //   return {
      //     accessToken,
      //     refreshToken: cachedToken,
      //   };
      // }

      const newRefreshToken = this.generateRefreshToken(user);
      const newAccessToken = this.generateAccessToken(user);

      // await this.refreshTokenService.updateUserRefreshToken({
      //   userId: user.userId,
      //   newToken: newRefreshToken,
      //   oldToken,
      // });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      console.error(error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  // async sendUpdatePasswordEmail(data: { email: string }) {
  //   try {
  //     const user = await this.userService.findOneByEmail(data.email);
  //     if (!user) throw new NotFoundException('User not found');

  //     const token = this.generatePasswordResetToken(user.email);

  //     const url = `${env.CLIENT_URL}/reset-password/${token}`;

  //     // this.emailService.sendEmail({
  //     //   html: resetPasswordHtml(url),
  //     //   subject: 'Reset your password',
  //     //   to: [user.email],
  //     // });
  //     return {
  //       message: 'Check email for password reset link',
  //       status: HttpStatus.OK,
  //     };
  //   } catch (error) {
  //     console.error(['Update Password Error'], error);
  //     if (error instanceof NotFoundException) throw error;
  //     throw new InternalServerErrorException('Could not update password');
  //   }
  // }

  // async registerUser(data: createUserDTO) {
  //   try {
  //     await this.userService.create(data);

  //     await Promise.all(
  //       newUserData.company.users.map((user) =>
  //         this.userNotificaitonService.createNotification({
  //           actionType: ActionType.NEW_USER,
  //           message: `${getDisplayName(newUserData.newUser)} is waiting for your approval`,
  //           userId: user.userId,
  //           newUserId: newUserData.newUser.userId,
  //         }),
  //       ),
  //     );
  //     const companyOwnerEmail = newUserData.company.users.find(
  //       (user) => user.role === Role.COMPANY_OWNER,
  //     ).email;
  //     return await this.emailService.sendNewUserEmail({
  //       newUserEmail: newUserData.newUser.email,
  //       newUserFullName: `${newUserData.newUser.firstName} ${newUserData.newUser.lastName}`,
  //       newUserId: newUserData.newUser.userId,
  //       companyOwnerEmail,
  //     });
  //   } catch (error) {
  //     console.error(['Register User Error'], error);
  //     if (error.code === 'P2002') {
  //       throw new HttpException('User already exists', 400);
  //     } else if (error instanceof NotFoundException) {
  //       throw error;
  //     } else {
  //       throw new InternalServerErrorException('Could not register user');
  //     }
  //   }
  // }

  private generateAccessToken(payload: object) {
    return this.jwtService.sign(payload, {
      expiresIn: '1h',
      secret: process.env.JWT_SECRET,
    });
  }

  private generateRefreshToken(payload: object) {
    return this.jwtService.sign(payload, {
      expiresIn: '30d',
      secret: env.JWT_REFRESH_SECRET,
    });
  }

  // private generatePasswordResetToken(email: string) {
  //   return this.jwtService.sign(
  //     { email },
  //     { secret: env.PASSWORD_RESET_SECRET, expiresIn: '1h' },
  //   );
  // }
}
