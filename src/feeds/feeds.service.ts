import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FeedsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllTags() {
    try {
      const tags = await this.prisma.tags.findMany();

      return { success: true, tags };
    } catch (error) {
      console.error('태그 목록 불러오는 중 에러 발생:', error);
      throw new InternalServerErrorException('서버에서 오류가 발생했습니다.');
    }
  }
}
