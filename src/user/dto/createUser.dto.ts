import { PartialType } from '@nestjs/mapped-types';
import { RoleList } from '@prisma/client';
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
  @IsEnum(['ADMIN', 'USER'], { each: true })
  @Transform(({ value }: { value: string[] }) => {
    const roles = value.reduce((acc: RoleList[], role: string) => {
      if (isNaN(Number(role)) && role.toUpperCase() in RoleList) {
        acc.push(role.toUpperCase() as RoleList);
      }

      return acc;
    }, []);

    return roles;
  })
  roles?: RoleList[];

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

  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
