import {
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetMessagesDto } from './dto/getMessages.dto';
import { S3Service } from 'src/s3/s3.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3: S3Service,
  ) {}

  async getAllRooms() {
    try {
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
    } catch (error) {
      console.error('전체 채팅방 조회 중 오류 발생', error);
      throw new InternalServerErrorException('서버에서 오류가 발생했습니다.');
    }
  }

  async getRecentMessages(userId: number, roomId: number) {
    try {
      const userData = await this.prisma.roomUsers.findFirst({
        where: { userId, roomId },
      });

      if (!userData) {
        throw new ForbiddenException('채팅방에 참여 중인 유저가 아닙니다.');
      }

      const joinedAt = userData.joinedAt;

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
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      console.error('최근 메세지 조회 중 오류 발생:', error);
      throw new InternalServerErrorException('서버에서 오류가 발생했습니다.');
    }
  }

  async getMyRooms(userId: number) {
    try {
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
    } catch (error) {
      console.error('참여 중인 채팅방 조회 중 오류 발생:', error);
      throw new InternalServerErrorException('서버에서 오류가 발생했습니다.');
    }
  }

  async getMessages(roomId: number, getMessagesDto: GetMessagesDto) {
    try {
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
    } catch (error) {
      console.error('메세지 무한스크롤 중 오류 발생 :', error);
      throw new InternalServerErrorException('서버에서 오류가 발생했습니다.');
    }
  }

  async uploadChatImage(file: Express.Multer.File) {
    const image = await this.s3.uploadImageToS3(file, 'chat');

    return { success: true, imageUrl: image.imageUrl };
  }

  async createMessage(userId: number, roomId: number, content: string) {
    const message = await this.prisma.messages.create({
      data: {
        cheerRoomId: roomId,
        userId,
        content,
      },
      include: {
        users: {
          select: {
            nickname: true,
            profileUrl: true,
          },
        },
      },
    });

    const response = {
      id: message.id,
      userId: message.userId,
      nickname: message.users.nickname,
      profileUrl: message.users.profileUrl,
      content: message.content,
      createdAt: message.createdAt,
    };

    return response;
  }
}
