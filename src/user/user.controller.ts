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
  UnprocessableEntityException,
  BadRequestException,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UserService } from './user.service';
import { AdminGuard } from 'src/core-guards/admin.guard';
import { UpdateUserGuard } from './guards/update-user.guard';
import { FilterUserDTO } from './dto/filterUser.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { CreateUserDTO, UpdateUserDTO } from './dto/createUser.dto';
import { ErrorMessages } from 'src/lib/data';

// @UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AdminGuard)
  @Get()
  async findAllUsers(@Query() query: FilterUserDTO) {
    return await this.userService.findAllUsers(query);
  }

  @Get(':userId')
  async findOneById(@Param('userId') userId: string) {
    return await this.userService.findOneById(userId);
  }

  // @UseGuards(AdminGuard)
  @Post('/import')
  @UseInterceptors(FileInterceptor('file'))
  async importUsers(@UploadedFile() file: Express.Multer.File) {
    return await this.userService.parseAndCreateUsers(file);
  }

  // @UseGuards(AdminGuard)
  @Post('/export')
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

  @UseGuards(AdminGuard)
  @Post('/create')
  async createUser(@Body() data: CreateUserDTO) {
    return await this.userService.create(data);
  }

  // @UseGuards(UpdateUserGuard)
  @Patch(':id')
  async updateUserById(@Param('id') id: string, @Body() data: UpdateUserDTO) {
    if (Object.keys(data).length === 0) {
      throw new BadRequestException(
        'The provided data cannot be updated with this endpoint',
      );
    }
    return await this.userService.updateUserById(id, data);
  }

  // @UseGuards(UpdateUserGuard)
  @Patch(':id/flip-first-login-status')
  async flipFirstLoginStatus(@Param('id') id: string) {
    return await this.userService.flipFirstLoginStatus(id);
  }

  @UseGuards(UpdateUserGuard)
  @Patch(':id/update-password')
  async updatePassword(
    @Param('id') id: string,
    @Body() data: { password: string },
  ) {
    return await this.userService.updateUserById(id, {
      password: data.password,
    });
  }

  @UseGuards(UpdateUserGuard)
  @Patch(':id/restore')
  async restoreUserById(@Param('id') id: string) {
    return await this.userService.restoreUserById(id);
  }

  @UseGuards(UpdateUserGuard)
  @Delete(':id')
  async deleteUserById(@Param('id') id: string) {
    return await this.userService.softDeleteUserById(id);
  }
}
