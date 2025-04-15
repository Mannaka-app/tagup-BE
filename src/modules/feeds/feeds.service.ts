import {
  ForbiddenException,
  HttpException,
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
    const imageUrl = await this.s3.uploadImageToS3(file, 'feed');

    return { success: true, imageUrl };
  }

  async createFeed(userId: number, createFeedDto: CreateFeedDto) {
    const { content, imageUrls } = createFeedDto;

    try {
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
    } catch (error) {
      console.error('피드 등록 중 오류 발생', error);
      throw new InternalServerErrorException('서버에서 오류가 발생했습니다.');
    }
  }

  async getFeeds(cursor: number) {
    try {
      const result = await this.prisma.feeds.findMany({
        orderBy: { id: 'desc' },
        where: cursor ? { id: { lt: cursor } } : {},
        take: 20,
        select: {
          id: true,
          FeedImages: { select: { url: true } },
        },
      });

      const feed = result.map((res) => ({
        id: res.id,
        image: res.FeedImages[0].url,
      }));

      return {
        success: true,
        feed,
        lastCursor: result[feed.length - 1]?.id || null,
      };
    } catch (error) {
      console.error('피드 전체 조회 중 오류 발생', error);
      throw new InternalServerErrorException('서버에서 오류가 발생했습니다.');
    }
  }

  async createFeedComment(userId: number, feedId: number, content: string) {
    try {
      await this.prisma.feedComments.create({
        data: { userId, feedId, content },
      });

      return { success: true, message: '댓글이 등록되었습니다.' };
    } catch (error) {
      console.error('댓글 작성 중 오류 발생', error);
      throw new InternalServerErrorException('서버에서 오류가 발생했습니다.');
    }
  }

  async getFeedComments(feedId: number) {
    try {
      const result = await this.prisma.feeds.findUnique({
        where: { id: feedId },
        select: {
          FeedComments: { include: { users: true } },
        },
      });

      if (!result) {
        throw new NotFoundException('피드를 찾을 수 없습니다.');
      }

      const comment = result.FeedComments.map((res) => ({
        id: res.id,
        userId: res.userId,
        nickName: res.users.nickname,
        profileUrl: res.users.profileUrl,
        userLevel: res.users.level,
        content: res.content,
        createdAt: res.createdAt,
      }));

      return { comment };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      console.error('피드 댓글 조회 중 오류 발생', error);
      throw new InternalServerErrorException('서버에서 오류가 발생했습니다.');
    }
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
    try {
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
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      console.error('피드 삭제 중 오류 발생', error);
      throw new InternalServerErrorException('서버에서 오류가 발생했습니다.');
    }
  }

  async handleFeedLikes(feedId: number, userId: number) {
    try {
      let message;

      await this.prisma.$transaction(async (prisma) => {
        const exist = await prisma.feedLike.findFirst({
          where: { feedId, userId },
        });

        if (exist) {
          await prisma.feedLike.deleteMany({
            where: { feedId, userId },
          });
          message = '좋아요가 삭제되었습니다.';
        } else {
          await prisma.feedLike.create({
            data: { feedId, userId },
          });
          message = '좋아요가 추가되었습니다.';
        }
      });

      return { success: true, message };
    } catch (error) {
      console.error('피드 좋아요 토글 중 오류 발생', error);
      throw new InternalServerErrorException('서버에서 오류가 발생했습니다.');
    }
  }
}
