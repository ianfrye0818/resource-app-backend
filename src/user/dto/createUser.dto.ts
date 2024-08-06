import { PartialType } from '@nestjs/mapped-types';
import { PermissionList, Role } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsEnum,
  IsBoolean,
  IsDate,
} from 'class-validator';

export class CreateUserDTO {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsEnum(['ADMIN', 'USER'], {})
  @Transform(({ value }: { value: string }) => value.toUpperCase())
  role?: Role;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateUserDTO extends PartialType(CreateUserDTO) {
  @IsOptional()
  @IsDate()
  deletedAt?: Date;

  @IsOptional()
  @IsBoolean()
  firstLogin?: boolean;
}
