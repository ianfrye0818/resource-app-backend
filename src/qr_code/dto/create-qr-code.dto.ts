import { PartialType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';

export class CreateQRCodeDTO {
  @IsString()
  qrCode: string;
}

export class UpdateQRCodeDTO extends PartialType(CreateQRCodeDTO) {}
2;
