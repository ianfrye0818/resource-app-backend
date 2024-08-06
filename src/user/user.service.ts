import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Cron } from '@nestjs/schedule';
import { Prisma, User } from '@prisma/client';
import { FilterUserDTO } from './dto/filterUser.dto';
import { PrismaService } from 'src/core-services/prisma-service.service';
import { generateClientSideUserProperties } from 'src/lib/utils';
import { CSVParserService } from 'src/core-services/csv-parser.service';
import { ErrorMessages } from 'src/lib/data';
import { CreateUserDTO } from './dto/createUser.dto';
import { CreateUserSchema } from 'src/lib/zod-schemas';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private csvParserService: CSVParserService,
    // private emailService: EmailService,
  ) {}

  async findAllUsers(filter: FilterUserDTO = {}) {
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
      throw new HttpException(ErrorMessages.Unknown, 500);
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
      throw new HttpException(ErrorMessages.Unknown, 500);
    }
  }

  async findOneByEmail(email: string) {
    try {
      return await this.prismaService.user.findUnique({
        where: { email },
      });
    } catch (error) {
      console.error(error);
      throw new HttpException(ErrorMessages.Unknown, 500);
    }
  }

  async create(data: CreateUserDTO) {
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
    throw new HttpException(ErrorMessages.Unknown, 500);
  }

  async parseAndCreateUsers(file: Express.Multer.File) {
    try {
      const headerMapping = {
        'First Name': 'firstName',
        'Last Name': 'lastName',
        Email: 'email',
        Password: 'password',
        Role: 'role',
        Active: 'isActive',
      };

      const users = await this.csvParserService.parseCSV(file, headerMapping);

      const parsedUsers = users.map((user) => {
        const { error } = CreateUserSchema.safeParse(user);
        if (error) {
          throw new HttpException(
            error.errors.map((err) => ({
              zodError: err.code,
              message:
                err.path.map((path) => path.toLocaleString()).join(' -> ') +
                ' ' +
                err.message,
            })),
            400,
          );
        }
        return user;
      });

      await Promise.all(parsedUsers.map((user) => this.create(user as User)));
      return HttpStatus.OK;
    } catch (error) {
      console.error(['parseAndCreateUsers error:'], error);

      if (error instanceof BadRequestException) {
        throw error;
      }

      if (error.code === 'P2002' || error.code === 'P2020') {
        throw new ConflictException(ErrorMessages.Duplicate);
      }

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(ErrorMessages.Unknown);
    }
  }

  async exportUsersToCSV() {
    try {
      const users = await this.findAllUsers();

      const headers = [
        { id: 'userId' as const, title: 'User ID' },
        { id: 'firstName' as const, title: 'First Name' },
        { id: 'lastName' as const, title: 'Last Name' },
        { id: 'email' as const, title: 'Email' },
        { id: 'role' as const, title: 'Role' },
        { id: 'isActive' as const, title: 'Active' },
        { id: 'permissions' as const, title: 'Permissions' },
      ];

      return await this.csvParserService.exportToCSV(users, 'users', headers);
    } catch (error) {
      console.error(['exportUsersToCSV'], error);
      throw new HttpException(ErrorMessages.Unknown, 500);
    }
  }

  async updateUserById(userId: string, data: Prisma.UserUpdateInput) {
    try {
      if (data.password) {
        data.password = await bcrypt.hash(data.password as string, 10);
      }

      const updatedUser = await this.prismaService.user.update({
        where: { userId },
        data,
      });

      return generateClientSideUserProperties(updatedUser);
    } catch (error) {
      console.error(['updateByEmail'], error);
      if (error.code === 'P2020') {
        throw new HttpException('User not found', 404);
      }
      throw new InternalServerErrorException(ErrorMessages.Unknown);
    }
  }

  async updateByEmail(email: string, data: Prisma.UserUpdateInput) {
    try {
      if (data.password) {
        data.password = await bcrypt.hash(data.password as string, 10);
      }

      const updatedUser = await this.prismaService.user.update({
        where: { email },
        data,
      });

      return generateClientSideUserProperties(updatedUser);
    } catch (error) {
      console.error(['updateByEmail'], error);
      if (error.code === 'P2020') {
        throw new HttpException(ErrorMessages.NotFound, 404);
      }
      throw new InternalServerErrorException(ErrorMessages.Unknown);
    }
  }

  async flipFirstLoginStatus(userId: string) {
    return await this.updateUserById(userId, { firstLogin: false });
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
