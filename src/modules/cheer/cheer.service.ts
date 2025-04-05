import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { PaginationQueryDto } from './dto/paginationQuery.dto';

@Injectable()
export class CheerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async createCheerTalk(userId: number, content: string) {
    const user = await this.usersService.getUserById(userId);

    await this.prisma.cheerTalk.create({
      data: {
        userId,
        content,
        createdAt: new Date(),
        team: user.team,
      },
    });

    return { success: true, message: '응원 등록이 완료됐습니다.' };
  }

  async getCheerTalks(userId: number, paginationQueryDto: PaginationQueryDto) {
    const { cursor = 0, limit = 10 } = paginationQueryDto;

    const user = await this.usersService.getUserById(userId);

    const result = await this.prisma.cheerTalk.findMany({
      orderBy: { id: 'desc' },
      where: { team: user.team, ...(cursor && { id: { lt: cursor } }) },
      take: limit,
      include: {
        users: {
          select: {
            nickname: true,
            profileUrl: true,
            level: true,
          },
        },
        CheerTalkLikes: true,
      },
    });

    const cheerTalks = result.map((res) => ({
      id: res.id,
      userId: res.userId,
      nickname: res.users.nickname,
      profileUrl: res.users.profileUrl,
      userLevel: res.users.level,
      content: res.content,
      createdAt: res.createdAt,
      likes: res.CheerTalkLikes.length,
    }));

    const lastCursor = cheerTalks[cheerTalks.length - 1]?.id || null;

    return { cheerTalks, lastCursor };
  }
}
