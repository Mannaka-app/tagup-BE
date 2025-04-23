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
}
