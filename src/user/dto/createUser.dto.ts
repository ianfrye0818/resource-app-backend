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
  IsArray,
} from 'class-validator';

export class createUserDTO {
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

export class updateUserDTO extends PartialType(createUserDTO) {
  @IsOptional()
  @IsDate()
  deletedAt?: Date;

  @IsOptional()
  @IsEnum(PermissionList, { each: true })
  permissions?: PermissionList[];
}
