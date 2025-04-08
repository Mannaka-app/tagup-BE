import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
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

    const feed = [];
    for (const res of result) {
      const data = await this.formatFeed(res, userId);
      feed.push(data);
    }

    return { feed };
  }

  async createFeedComment(userId: number, feedId: number, content: string) {
    await this.prisma.feedComments.create({
      data: { userId, feedId, content },
    });

    return { success: true, message: '댓글이 등록되었습니다.' };
  }

  async getFeedById(feedId: number, userId: number) {
    const result = await this.prisma.feeds.findUnique({
      where: { id: feedId },
      include: {
        users: true,
        FeedImages: true,
        FeedTags: true,
        likes: true,
        FeedComments: { include: { users: true } },
      },
    });

    if (!result) {
      throw new NotFoundException('피드를 찾을 수 없습니다.');
    }

    const feed = await this.formatFeed(result, userId);
    const comment = result.FeedComments.map((res) => ({
      id: res.id,
      userId: res.userId,
      nickName: res.users.nickname,
      profileUrl: res.users.profileUrl,
      userLevel: res.users.level,
      content: res.content,
      createdAt: res.createdAt,
    }));

    return { feed, comment };
  }

  async formatFeed(result, userId: number) {
    return {
      id: result.id,
      userId: result.userId,
      userTeamId: result.users.team,
      nickName: result.users.nickname,
      profileUrl: result.users.profileUrl,
      userLevel: result.users.level,
      content: result.content,
      createdAt: result.createdAt,
      images: result.FeedImages.map((img) => img.url),
      comments: result.FeedComments.length,
      likes: result.likes.length,
      isLiked: result.likes.filter((like) => like.userId == userId).length,
    };
  }

  async deleteFeed(feedId: number, userId: number) {
    const feed = await this.prisma.feeds.findUnique({
      where: { id: feedId },
    });

    if (!feed) {
      throw new NotFoundException('피드를 찾을 수 없습니다.');
    }

    if (feed.userId !== userId) {
      throw new ForbiddenException('권한이 없습니다.');
    }

    await this.prisma.feeds.delete({
      where: { id: feedId },
    });

    return { success: true, message: '피드가 삭제되었습니다.' };
  }
}
