import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class CheerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async createCheerTalk(user, content: string) {
    const { userId } = user;

    const data = await this.usersService.getUserById(userId);

    await this.prisma.cheerTalk.create({
      data: {
        userId,
        content,
        createdAt: new Date(),
        team: data.team,
      },
    });

    return { success: true, message: '응원 등록이 완료됐습니다.' };
  }
}
