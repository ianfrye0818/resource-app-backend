import {
  Controller,
  HttpException,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ResumeParserService } from './resume-parser.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('resume-parser')
export class ResumeParserController {
  constructor(private readonly resumeParserService: ResumeParserService) {}

  @Post('generate-formatted-resume')
  @UseInterceptors(FileInterceptor('file'))
  async generateFormattedResume(
    @Query('type') type: string,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    const formattedResume =
      await this.resumeParserService.generateFormattedResume(file, type);

    if (formattedResume instanceof HttpException) {
      throw formattedResume;
    }

    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="resume.docx"`,
      'Content-Length': formattedResume.length,
    });

    res.send(formattedResume);
  }
}
