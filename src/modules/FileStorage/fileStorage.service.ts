import { HttpException, Injectable } from '@nestjs/common';
import { MulterFile } from 'multer';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import * as fs from 'fs';
import sharp from 'sharp';
import * as path from 'path';
import * as moment from 'moment';
import { BASE_URL } from 'src/common/constant';
import { v4 as uuidv4 } from 'uuid';
import { promises as fsPromises } from 'fs';


@Injectable()
export class FileStorageService {
  private s3: S3Client;
  public supportedFileTypes: string[];

  constructor() {
    // Initialize the S3 client (assuming you're using AWS S3 for file storage)
    this.s3 = new S3Client({
      region: 'YOUR_S3_REGION',
      credentials: {
        accessKeyId: 'YOUR_ACCESS_KEY',
        secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
      },
    });

    this.supportedFileTypes = ['image/jpeg', 'image/png', 'image/gif'];
  }

  async uploadFileToLocalStorage(
    file: MulterFile,
    folderName: string,
    customFileName: string,
    customFileType: any,
  ): Promise<any> {
    // Check the file type
    this.supportedFileTypes = customFileType || this.supportedFileTypes;

    if (!file || !file.originalname || !file.buffer) {
      throw new HttpException('No file provided', 400);
    }

    if (!this.isSupportedFileType(file.mimetype)) {
      throw new HttpException(
        `Unsupported file type. Only ${customFileType.join(
          ', ',
        )} files are allowed.`,
        400,
      );
    }

    const directoryPath = path.resolve(
      __dirname,
      '../../..',
      `public/${folderName}`,
    );

    if (!fs.existsSync(directoryPath)) {
      fs.mkdir(directoryPath, { recursive: true }, (err) => {
        if (err) {
          return;
        }
      });
    }

    const uniqueFilename = `${customFileName}-${uuidv4()}${path.extname(file.originalname)}`;

    const filePath = `${path.join(
      path.resolve(__dirname, '../../..', `public/${folderName}`),
    )}/${uniqueFilename}`;

    // Compress the image using sharp
    // const compressedBuffer = await sharp(file.buffer)
    //   .resize(800, 600)
    //   .toBuffer();

    await fs.promises.writeFile(filePath, file.buffer);

    return {
      filePath: `${BASE_URL}/${folderName}/${uniqueFilename}`,
      fileName: uniqueFilename,
    };
  }

  async uploadFileToS3(
    file: MulterFile,
    customPath: string,
    customFileType: string,
  ): Promise<string> {
    // Check the file type
    if (file.mimetype !== customFileType) {
      throw new Error(
        `Unsupported file type. Only ${customFileType} files are allowed.`,
      );
    }

    const uniqueFilename = `${moment(new Date()).format('YYYY-MM-DD')}-${
      file.originalname
    }`;
    const key = `${customPath}/${uniqueFilename}`;

    // Compress the image using sharp
    const compressedBuffer = await sharp(file.buffer)
      .resize(800, 600)
      .toBuffer();

    const command = new PutObjectCommand({
      Bucket: 'YOUR_BUCKET_NAME',
      Key: key,
      Body: compressedBuffer,
    });

    await this.s3.send(command);

    return key;
  }

  async checkFileExistsInLocalStorage(folderName: string, fileName: string): Promise<boolean> {
    try {
      const filePath = `${path.join(
        path.resolve(__dirname, '../../..', `public/${folderName}`),
      )}/${fileName}`;
       await fsPromises.access(filePath);
      return true;
    } catch (err) {
      return false;
    }
  }

  async deleteFileFromLocalStorage(folderName: string, fileName: string): Promise<void> {
    console.log('the filename is',fileName)
    try {
      const filePath = `${path.join(
        path.resolve(__dirname, '../../..', `public/${folderName}`),
      )}/${fileName}`;

    await fsPromises.access(filePath); // Check if the file exists
    await fsPromises.unlink(filePath); // Delete the file
    } catch (err) {
      throw new Error(`Failed to delete file from local storage: ${err.message}`);
    }
  }

  async deleteFileFromS3(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: 'YOUR_BUCKET_NAME',
      Key: key,
    });

    await this.s3.send(command);
  }

  private isSupportedFileType(mimetype: string): boolean {
    return this.supportedFileTypes.includes(mimetype);
  }
}
