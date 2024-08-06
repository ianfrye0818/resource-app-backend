/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { QrCodeService } from './qr_code.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CreateQRCodeDTO } from './dto/create-qr-code.dto';

@UseGuards(JwtGuard)
@Controller('qr-code')
export class QrCodeController {
  constructor(private readonly qrCodeService: QrCodeService) {}

  @Get()
  async getAllCodes(@Req() req: any) {
    return this.qrCodeService.getAllCodes(req.user.userId);
  }

  @Get(':id')
  async getCodeById(@Param('id') id: string, @Req() req: any) {
    return this.qrCodeService.getCodeById(id, req.user.userId);
  }

  @Post()
  async createCode(@Req() req: any, @Body() body: CreateQRCodeDTO) {
    return this.qrCodeService.createCode(req.user.userId, body);
  }

  @Delete(':id')
  async deleteCode(@Param('id') id: string, @Req() req: any) {
    return this.qrCodeService.deleteCode(id, req.user.userId);
  }
}
