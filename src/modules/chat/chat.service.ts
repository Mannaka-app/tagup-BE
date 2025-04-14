import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetMessagesDto } from './dto/getMessages.dto';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllRooms() {
    const result = await this.prisma.rooms.findMany({
      include: {
        RoomUsers: true,
        Messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    const rooms = result.map((res) => ({
      id: res.id,
      title: res.title,
      createAt: res.createdAt,
      members: res.RoomUsers.length,
      lastMessage: res.Messages[0] ? res.Messages[0].createdAt : null,
    }));

    return {
      success: true,
      message: '전체 채팅방 조회에 성공했습니다.',
      rooms,
    };
  }

  async getRecentMessages(userId: number, roomId: number) {
    const userData = await this.prisma.roomUsers.findMany({
      where: { userId, roomId },
    });

    const joinedAt = userData[0].joinedAt;

    const result = await this.prisma.messages.findMany({
      where: { roomId, createdAt: { gt: joinedAt } },
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

    return { messages };
  }

  async getMyRooms(userId: number) {
    const result = await this.prisma.rooms.findMany({
      where: { RoomUsers: { some: { userId } } },
      include: {
        RoomUsers: true,
        Messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    const rooms = result.map((res) => ({
      id: res.id,
      title: res.title,
      createAt: res.createdAt,
      members: res.RoomUsers.length,
      lastMessage: res.Messages[0] ? res.Messages[0].createdAt : null,
    }));

    return {
      success: true,
      message: '참여중인 채팅방 조회에 성공했습니다.',
      rooms,
    };
  }

  async getMessages(roomId: number, getMessagesDto: GetMessagesDto) {
    const { cursor, direction } = getMessagesDto;
    const limit = 15;

    const result = await this.prisma.messages.findMany({
      where: {
        roomId,
        id: direction === 'down' ? { gt: cursor } : { lt: cursor },
      },
      orderBy: { id: 'desc' },
      take: limit,
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

    return {
      success: true,
      message: '메세지 조회에 성공했습니다.',
      messages,
      firstCursor: messages.length ? messages[0].id : null,
      lastCursor: messages.length ? messages[messages.length - 1].id : null,
    };
  }
}
