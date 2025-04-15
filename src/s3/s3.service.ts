import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { S3 } from 'aws-sdk';
import * as crypto from 'crypto';

@Injectable()
export class S3Service {
  private s3 = new S3({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });

  private bucketName = process.env.AWS_S3_BUCKET_NAME;

  async uploadImage(
    userId: number,
    fileBuffer: Buffer,
    fileType: string,
    prefix: string,
  ): Promise<string> {
    try {
      const filePrefix = prefix;
      const fileName = `${filePrefix}_${crypto.randomUUID()}.${fileType}`;
      const uploadResult = await this.s3
        .upload({
          Bucket: this.bucketName,
          Key: fileName,
          Body: fileBuffer,
          ContentType: `image/${fileType}`,
        })
        .promise();

      return uploadResult.Location;
    } catch (error) {
      console.error('S3 Upload Error:', error); // 에러 로깅
      throw new InternalServerErrorException('S3 업로드 중 오류 발생');
    }
  }

  async uploadImageToS3(file: Express.Multer.File, prefix: string) {
    if (!file) {
      throw new BadRequestException('파일이 제공되지 않았습니다.');
    }

    const fileType = file.mimetype.split('/')[1];

    if (!fileType) {
      throw new BadRequestException('유효하지 않은 파일 형식입니다.');
    }

    try {
      const imageUrl = await this.uploadImage(
        8,
        file.buffer,
        fileType,
        `${prefix}/`,
      );

      return { success: true, imageUrl };
    } catch (error) {
      console.error('이미지 업로드 중 오류 발생', error);
      throw new InternalServerErrorException('이미지 업로드에 실패했습니다.');
    }
  }
}
