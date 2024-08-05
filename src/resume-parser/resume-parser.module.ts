import { Module } from '@nestjs/common';
import { ResumeParserController } from './resume-parser.controller';
import { ResumeParserService } from './resume-parser.service';
import { ResumeGeneratorService } from './resume-generator.service';

@Module({
  controllers: [ResumeParserController],
  providers: [ResumeParserService, ResumeGeneratorService],
  exports: [ResumeParserService],
})
export class ResumeParserModule {}
