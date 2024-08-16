import { PartialType } from '@nestjs/mapped-types';
import {
  EcolabLocation,
  EcolabPosition,
  EcolabShift,
  EcolabTerminationReason,
} from '@prisma/client';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateEcolabAssignmentDTO {
  @IsString()
  beelineRequestId: string;

  @IsDate()
  startDate: Date;

  @IsDate()
  dtCompletedDate: Date;

  @IsDate()
  backgroundCompletedDate: Date;

  @IsBoolean()
  educationVerified: boolean;

  @IsEnum(EcolabPosition)
  position: EcolabPosition;

  @IsEnum(EcolabLocation)
  location: EcolabLocation;

  @IsEnum(EcolabShift)
  shift: EcolabShift;

  @IsNumber()
  payRate: number;

  @IsString()
  ctsUserId: string;
}

export class UpdateEcolabAssignmentDTO extends PartialType(
  CreateEcolabAssignmentDTO,
) {
  @IsOptional()
  @IsDate()
  endDate?: Date;

  @IsOptional()
  @IsEnum(EcolabTerminationReason)
  terminationReason?: EcolabTerminationReason;

  @IsOptional()
  @IsString()
  terminationNotes?: string;
}
