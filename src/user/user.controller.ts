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
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UserService } from './user.service';
import { AdminGuard } from 'src/core-guards/admin.guard';
import { UpdateUserGuard } from './guards/update-user.guard';
import { FilterUserDTO } from './dto/filterUser.dto';
import { createUserDTO, updateUserDTO } from './dto/createUser.dto';

@UseGuards(JwtGuard)
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

  @UseGuards(AdminGuard)
  @Post('/create')
  async createUser(@Body() data: createUserDTO) {
    return await this.userService.create(data);
  }

  @UseGuards(UpdateUserGuard)
  @Patch(':id')
  async updateUserById(@Param('id') id: string, @Body() data: updateUserDTO) {
    return await this.userService.updateUserById(id, data);
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
