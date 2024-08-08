import { Injectable } from '@nestjs/common';
import { env } from 'env';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  private API_KEY: string = env.CLOUDINARY_API_KEY;
  private API_SECRET: string = env.CLOUDINARY_API_SECRET;
  private CLOUD_NAME: string = env.CLOUDINARY_CLOUD_NAME;
  private cloudinaryConfig: Record<string, string>;
  constructor() {
    this.cloudinaryConfig = {
      cloud_name: this.CLOUD_NAME,
      api_key: this.API_KEY,
      api_secret: this.API_SECRET,
    };
  }

  async uploadImage(
    userId: string,
    file: Express.Multer.File,
  ): Promise<UploadApiResponse> {
    try {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: userId,
            use_filename: true,
            transformation: { width: 500, height: 500, crop: 'limit' },
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          },
        );

        const readableStream = Readable.from(file.buffer);
        readableStream.pipe(uploadStream);
      });
    } catch (error) {
      console.error(['uploadImage'], error);
      throw error;
    }
  }

  async getImages(userId: string) {
    return await cloudinary.api.resources({
      type: 'upload',
      prefix: userId,
    });
  }
}
