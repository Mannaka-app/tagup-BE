import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from '../users/users.service';

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

  async getCheerTalks(userId: number) {
    const user = await this.usersService.getUserById(userId);

    const result = await this.prisma.cheerTalk.findMany({
      where: { team: user.team },
      include: {
        users: {
          select: {
            nickname: true,
            profileUrl: true,
            gender: true,
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
      gender: res.users.gender,
      userLevel: res.users.level,
      content: res.content,
      createdAt: res.createdAt,
      likes: res.CheerTalkLikes.length,
    }));

    return cheerTalks;
  }
}
