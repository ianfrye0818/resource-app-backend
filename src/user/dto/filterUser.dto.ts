import { RoleList } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

export class FilterUserDTO {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @Transform(({ value }: { value: string }) => {
    return value
      .toUpperCase()
      .split(',')
      .map((role: string) => role as RoleList);
  })
  roles?: RoleList[];

  @IsOptional()
  @IsDate()
  deletedAt?: Date;

  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  updatedAt?: Date;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  take?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  skip?: number;

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sort?: 'asc' | 'desc';
}
