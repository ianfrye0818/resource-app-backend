import { Injectable } from '@nestjs/common';
import { AIModel } from 'src/core-services/AI-models.service';
import { ErrorMessages, getPrompt } from 'src/lib/data';
import {
  checkIfValidresume,
  cleanJsonString,
  getFormattedDate,
} from 'src/lib/utils';
import * as fs from 'fs';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import * as mammoth from 'mammoth';
import * as pdfParse from 'pdf-parse';
import { ParsedJson } from 'src/lib/types.';
import { join } from 'path';

@Injectable()
export class ResumeGeneratorService {
  async parseResumeToJson(resumeText: string, aiModel: AIModel) {
    const cleanedDocument = resumeText.replace(/[^a-zA-Z0-9\s]/g, '');

    const prompt = getPrompt(cleanedDocument);

    const responseText = await aiModel.generateContent([prompt]);

    if (responseText.length === 0) {
      throw new Error(ErrorMessages.Unknown);
    }

    if (responseText.includes('not a resume')) {
      throw new Error(ErrorMessages.NotResume);
    }

    const cleanedResponse = cleanJsonString(responseText);

    const parsedJson = JSON.parse(cleanedResponse);

    parsedJson.todaysDate = getFormattedDate();

    checkIfValidresume(parsedJson);

    return parsedJson;
  }

  async createResumeTemplate(parsedJson: ParsedJson) {
    const content = fs.readFileSync(
      join(process.cwd(), '/src/lib/', 'input.docx'),
      'binary',
    );
    const zip = new PizZip(content);

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    doc.render(parsedJson);

    const buf = doc.getZip().generate({
      type: 'nodebuffer',
      compression: 'DEFLATE',
    });

    return buf;
  }

  async collectResumeText(buffer: Buffer, fileName: string, model: AIModel) {
    let data: string;

    if (fileName.endsWith('docx') || fileName.endsWith('doc')) {
      const parsedData = await mammoth.extractRawText({ buffer });
      data = parsedData.value;
    } else if (fileName.endsWith('pdf')) {
      const parsed = await pdfParse(buffer);
      data = parsed.text;
    } else {
      throw new Error(ErrorMessages.InvalidResume);
    }

    return this.parseResumeToJson(data, model);
  }
}
