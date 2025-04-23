import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CheerService {
  constructor(private readonly prisma: PrismaService) {}

  async getTeamCheerTalk(teamId: number) {
    const result = await this.prisma.cheerRooms.findUnique({
      where: { teamId },
    });

    return { success: true, cheerRoom: result };
  }

  async getCheerRoomMessages(roomId: number, cursor: number | null) {
    const result = await this.prisma.messages.findMany({
      where: { cheerRoomId: roomId, ...(cursor ? { id: { lt: cursor } } : {}) },
      orderBy: { id: 'desc' },
      take: 15,
      include: {
        users: {
          select: {
            nickname: true,
            profileUrl: true,
          },
        },
      },
    });

    const messages = result.reverse().map((res) => ({
      id: res.id,
      userId: res.userId,
      nickname: res.users.nickname,
      profileUrl: res.users.profileUrl,
      content: res.content,
      createdAt: res.createdAt,
    }));

    const lastCursor = messages[0]?.id || null;

    return { success: true, messages, lastCursor };
  }
}
