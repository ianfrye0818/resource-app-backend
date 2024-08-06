import { PartialType } from '@nestjs/mapped-types';
import { EcolabLocation } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateEcolabManagerDTO {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsEnum(EcolabLocation)
  location: EcolabLocation;
}

export class UpdateEcolabManagerDTO extends PartialType(
  CreateEcolabManagerDTO,
) {}
