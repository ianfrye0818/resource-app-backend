import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
  Post,
  HttpException,
  UseInterceptors,
  Res,
  UploadedFile,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UserService } from './user.service';
import { AdminGuard } from 'src/core-guards/admin.guard';
import { UpdateUserGuard } from './guards/update-user.guard';
import { FilterUserDTO } from './dto/filterUser.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { CreateUserDTO, UpdateUserDTO } from './dto/createUser.dto';

// @UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @UseGuards(AdminGuard)
  @Get()
  async findAllUsers(@Query() query: FilterUserDTO) {
    return await this.userService.findAllUsers(query);
  }

  @Get(':userId')
  async findOneById(@Param('userId') userId: string) {
    return await this.userService.findOneById(userId);
  }

  // @UseGuards(AdminGuard)
  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importUsers(@UploadedFile() file: Express.Multer.File) {
    return await this.userService.parseAndCreateUsers(file);
  }

  // @UseGuards(AdminGuard)
  @Post('export')
  async exportUsers(@Res() res: Response) {
    const exportedUsers = await this.userService.exportUsersToCSV();

    if (
      exportedUsers instanceof Error ||
      exportedUsers instanceof HttpException
    ) {
      throw exportedUsers;
    }

    res.set({
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="users.csv"`,
      'Content-Length': exportedUsers.length,
    });

    res.send(exportedUsers);
  }

  // @UseGuards(AdminGuard)
  @Post('create')
  async createUser(@Body() data: CreateUserDTO) {
    return await this.userService.create(data);
  }

  // @UseGuards(UpdateUserGuard)
  @Patch(':userId')
  async updateUserById(
    @Param('userId') userId: string,
    @Body() data: UpdateUserDTO,
  ) {
    if (Object.keys(data).length === 0) {
      throw new BadRequestException(
        'The provided data cannot be updated with this endpoint',
      );
    }
    return await this.userService.updateUserById(userId, data);
  }

  // @UseGuards(UpdateUserGuard)
  @Patch(':userId/flip-first-login-status')
  async flipFirstLoginStatus(@Param('userId') userId: string) {
    return await this.userService.flipFirstLoginStatus(userId);
  }

  @UseGuards(UpdateUserGuard)
  @Patch(':userId/update-password')
  async updatePassword(
    @Param('userId') userId: string,
    @Body() data: { password: string },
  ) {
    return await this.userService.updateUserById(userId, {
      password: data.password,
    });
  }

  // @UseGuards(UpdateUserGuard)
  @Post(':userId/upload-avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadAvatar(
    @Param('userId') userId: string,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    return await this.userService.uploadAvatar(userId, avatar);
  }

  @Get(':userId/images')
  async getUserImages(@Param('userId') userId: string) {
    return await this.userService.getUserImages(userId);
  }

  @UseGuards(UpdateUserGuard)
  @Patch(':userId/restore')
  async restoreUserById(@Param('userId') userId: string) {
    return await this.userService.restoreUserById(userId);
  }

  @UseGuards(UpdateUserGuard)
  @Delete(':userId')
  async deleteUserById(@Param('userId') userId: string) {
    return await this.userService.softDeleteUserById(userId);
  }
}
