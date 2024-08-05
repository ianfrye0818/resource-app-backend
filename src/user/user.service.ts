import {
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { createUserDTO, updateUserDTO } from './dto/createUser.dto';
import * as bcrypt from 'bcryptjs';
import { Cron } from '@nestjs/schedule';
import { Prisma } from '@prisma/client';
import { FilterUserDTO } from './dto/filterUser.dto';
import { PrismaService } from 'src/core-services/prisma-service.service';
import { generateClientSideUserProperties } from 'src/lib/utils';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    // private emailService: EmailService,
  ) {}

  async findAllUsers(filter: FilterUserDTO) {
    const { take, skip, sort, roles, ...otherFilters } = filter;
    try {
      const users = await this.prismaService.user.findMany({
        where: {
          role: { in: roles },
          ...otherFilters,
        },
        orderBy: [
          { role: sort || 'desc' },
          { lastName: 'asc' },
          { userId: 'asc' },
        ],

        take,
        skip: skip || 0,
      });
      return users.map((user) => generateClientSideUserProperties(user));
    } catch (error) {
      console.error(error);
      throw new HttpException('Something went wrong', 500);
    }
  }

  async findOneById(userId: string) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { userId },
      });
      return generateClientSideUserProperties(user);
    } catch (error) {
      console.error(error);
      if (
        error instanceof UnauthorizedException ||
        error instanceof NotFoundException
      )
        throw error;
      throw new HttpException('Something went wrong', 500);
    }
  }

  async findOneByEmail(email: string) {
    try {
      return await this.prismaService.user.findUnique({
        where: { email },
      });
    } catch (error) {
      console.error(error);
      throw new HttpException('Something went wrong', 500);
    }
  }

  async create(data: createUserDTO) {
    const { password, ...userData } = data;

    const hashedPassword = await bcrypt.hash(password, 10);
    const formattedEmail = userData.email.toLowerCase();

    const newUser = await this.prismaService.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        email: formattedEmail,
      },
    });

    return generateClientSideUserProperties(newUser);
  }
  catch(error) {
    console.error(error);
    if (error.code === 'P2002') {
      throw new HttpException('User already exists', 400);
    }
    if ((error.statusCode = 400)) {
      throw error;
    }
    throw new HttpException('Something went wrong', 500);
  }

  async updateUserById(userId: string, data: updateUserDTO) {
    try {
      await this.findOneById(userId);

      if (data.password) data.password = await bcrypt.hash(data.password, 10);

      const updatedUser = await this.prismaService.user.update({
        where: { userId },
        data,
      });

      return generateClientSideUserProperties(updatedUser);
    } catch (error) {
      console.error(error);
      if (
        error instanceof UnauthorizedException ||
        error instanceof NotFoundException
      )
        throw error;
      throw new HttpException('Something went wrong', 500);
    }
  }

  async updateByEmail(email: string, data: Prisma.UserUpdateInput) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password as string, 10);
    }

    const updatedUser = await this.prismaService.user.update({
      where: { email },
      data,
    });

    return generateClientSideUserProperties(updatedUser);
  }

  async softDeleteUserById(id: string) {
    return this.updateUserById(id, { deletedAt: new Date(), isActive: false });
  }

  async restoreUserById(id: string) {
    return this.updateUserById(id, { deletedAt: null, isActive: true });
  }

  @Cron('0 0 * * *') // Run every night at midnight
  async permanentlyDeleteOldUsers() {
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - 30);

    try {
      await this.prismaService.user.deleteMany({
        where: {
          deletedAt: {
            lte: dateThreshold,
          },
        },
      });
    } catch (error) {
      console.error(error);
      // this.emailService.sendCronErrorNotification(
      //   error.message,
      //   'Delete Users',
      // );
    }
  }
}
