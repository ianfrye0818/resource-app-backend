/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as csv from 'csv-parser';
import { createObjectCsvWriter } from 'csv-writer';
import { Readable } from 'stream';
import { convertBoolean } from 'src/lib/utils';

@Injectable()
export class CSVParserService {
  async parseCSV<T>(
    file: Express.Multer.File,
    headerMapping: { [key: string]: keyof T },
  ): Promise<T[]> {
    const results: T[] = [];
    const bufferStream = new Readable();
    bufferStream.push(file.buffer);
    bufferStream.push(null);
    const headerMap: { [key: string]: string } = {};

    return new Promise((resolve, reject) => {
      bufferStream
        .pipe(csv())
        .on('headers', (headers) => {
          headers.forEach((header) => {
            if (headerMapping[header]) {
              headerMap[header] = headerMapping[header].toString();
            }
          });
        })
        .on('data', (data) => {
          const transformedData = this.transformData(data, headerMap);
          results.push(transformedData);
        })
        .on('end', () => {
          resolve(results);
        })
        .on('error', (error) => reject(error));
    });
  }
  async exportToCSV<T>(
    data: T[],
    fileName: string,
    headers: { id: keyof T; title: string }[],
  ): Promise<Buffer> {
    const csWriter = createObjectCsvWriter({
      path: `./${fileName}.csv`,
      header: headers.map((header) => ({
        id: header.id as string,
        title: header.title,
      })),
    });

    try {
      await csWriter.writeRecords(data);
      const file = fs.readFileSync(`./${fileName}.csv`);
      return file;
    } catch (error) {
      console.error(['csv-parser.service', 'exportToCSV'], error);
      throw new Error('Falied to Write to CSV File');
    }
  }

  private transformData(data: any, headerMap: { [key: string]: string }): any {
    const transformed: any = {};
    Object.keys(data).forEach((key) => {
      const mappedKey = headerMap[key];
      if (mappedKey) {
        transformed[mappedKey] = convertBoolean(data[key]);
      }
    });
    return transformed;
  }
}
