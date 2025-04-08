import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3Service } from 'src/s3/s3.service';
import { CreateFeedDto } from './dto/createFeed.dto';

@Injectable()
export class FeedsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3: S3Service,
  ) {}

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

  async createFeed(userId: number, createFeedDto: CreateFeedDto) {
    const { content, imageUrls } = createFeedDto;

    await this.prisma.$transaction(async (prisma) => {
      const feed = await prisma.feeds.create({
        data: { userId, content },
      });

      await prisma.feedImages.createMany({
        data: imageUrls.map((url) => ({
          feedId: feed.id,
          url,
        })),
      });
    });

    return { success: true, message: '피드 등록이 완료됐습니다.' };
  }

  async getFeeds(userId: number) {
    const result = await this.prisma.feeds.findMany({
      orderBy: { id: 'desc' },
      include: {
        users: true,
        FeedImages: true,
        FeedTags: true,
        likes: true,
        FeedComments: true,
      },
    });

    const feed = result.map((res) => ({
      id: res.id,
      userId: res.userId,
      userTeamId: res.users.team,
      nickName: res.users.nickname,
      profileUrl: res.users.profileUrl,
      userLevel: res.users.level,
      content: res.content,
      createdAt: res.createdAt,
      images: res.FeedImages.map((img) => img.url),
      comments: res.FeedComments.length,
      likes: res.likes.length,
      isLiked: res.likes.filter((like) => like.userId == userId).length,
    }));

    return { feed };
  }

  async createFeedComment(userId: number, feedId: number, content: string) {
    await this.prisma.feedComments.create({
      data: { userId, feedId, content },
    });

    return { success: true, message: '댓글이 등록되었습니다.' };
  }
}
