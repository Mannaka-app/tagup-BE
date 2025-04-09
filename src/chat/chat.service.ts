import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllRooms() {
    const result = await this.prisma.rooms.findMany({
      include: { RoomUsers: true },
    });

    return result.map((res) => ({
      id: res.id,
      title: res.title,
      createAt: res.createdAt,
      members: res.RoomUsers.length,
    }));
  }

  async getMessages(userId: number, roomId: number) {
    const userData = await this.prisma.roomUsers.findMany({
      where: { userId, roomId },
    });

    const joinedAt = userData[0].joinedAt;

    const result = await this.prisma.messages.findMany({
      where: { roomId, createdAt: { gt: joinedAt } },
      include: {
        users: {
          select: {
            nickname: true,
            profileUrl: true,
            level: true,
          },
        },
      },
    });

    const messages = result.map((res) => ({
      id: res.id,
      userId: res.userId,
      nickname: res.users.nickname,
      profileUrl: res.users.profileUrl,
      userLevel: res.users.level,
      content: res.content,
      createdAt: res.createdAt,
    }));

    return { messages };
  }
}
