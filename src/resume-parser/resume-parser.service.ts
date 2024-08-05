import { HttpException, Injectable } from '@nestjs/common';
import { Models } from 'src/lib/types.';
import { ErrorMessages } from 'src/lib/data';
import { getAIModel } from 'src/core-services/AI-models.service';
import { rateLimit } from 'src/lib/rate-limit';
import { ResumeGeneratorService } from './resume-generator.service';

@Injectable()
export class ResumeParserService {
  constructor(
    private readonly resumeGeneratorService: ResumeGeneratorService,
  ) {}
  async generateFormattedResume(resume: Express.Multer.File, type: string) {
    if (Object.values(Models).indexOf(type as Models) === -1) {
      throw new HttpException(ErrorMessages.InvalidModel, 400);
    }

    if (!resume) {
      return new HttpException(ErrorMessages.NoFile, 400);
    }

    const allowedMimeTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ];

    if (!allowedMimeTypes.includes(resume.mimetype)) {
      throw new HttpException(ErrorMessages.InvalidFileType, 400);
    }

    const AiModel = getAIModel(type as Models);

    try {
      const buffer = resume.buffer;
      const filename = resume.originalname.replaceAll(' ', '_');

      const resumeData = await rateLimit(() =>
        this.resumeGeneratorService.collectResumeText(
          buffer,
          filename,
          AiModel,
        ),
      )();
      const formattedResume =
        await this.resumeGeneratorService.createResumeTemplate(resumeData);
      return formattedResume;
    } catch (error) {
      console.error(['Error parsing resume'], error);
      throw new HttpException(ErrorMessages.Unknown, 500);
    }
  }
}
