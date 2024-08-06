import { PartialType } from '@nestjs/mapped-types';
import { IsDate, IsString } from 'class-validator';

export class CreateEcolabEmployeeDTO {
  @IsString()
  bullhornId: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsDate()
  birthDate: Date;
}

export class UpdateEcolabEmployeeDTO extends PartialType(
  CreateEcolabEmployeeDTO,
) {}
