import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async getRooms() {
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
}
