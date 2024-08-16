import { EcolabLocation, EcolabPosition, EcolabShift } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class FilterAssignmentDTO {
  @IsOptional()
  @IsEnum(EcolabLocation)
  location?: EcolabLocation;

  @IsOptional()
  @IsEnum(EcolabShift)
  shift?: EcolabShift;

  @IsOptional()
  @IsEnum(EcolabPosition)
  position?: EcolabPosition;
}
