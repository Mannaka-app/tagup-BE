import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3Service } from 'src/s3/s3.service';

@Injectable()
export class FeedsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3: S3Service,
  ) {}

  async getAllTags() {
    try {
      const tags = await this.prisma.tags.findMany();

      return { success: true, tags };
    } catch (error) {
      console.error('태그 목록 불러오는 중 에러 발생:', error);
      throw new InternalServerErrorException('서버에서 오류가 발생했습니다.');
    }
  }

  async uploadFeedImage(file: Express.Multer.File) {
    try {
      const fileType = file.mimetype.split('/')[1];
      if (!fileType) {
        throw new BadRequestException('유효하지 않은 파일 형식입니다.');
      }

      const imageUrl = await this.s3.uploadImage(
        8,
        file.buffer,
        fileType,
        'feed/',
      );

      return { success: true, imageUrl };
    } catch (error) {
      console.error('이미지 업로드 중 오류 발생', error);
      throw new InternalServerErrorException('이미지 업로드에 실패했습니다.');
    }
  }
}
