import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GameService {
  constructor(private readonly prisma: PrismaService) {}

  async getGameSchedules() {
    const result = await this.prisma.gameSchedule.findMany({
      orderBy: { date: 'asc' },

      include: {
        homeTeam: true,
        awayTeam: true,
        stadiumInfo: true,
      },
    });

    const schedules = result.map((res) => ({
      id: res.id,
      home: res.homeTeam,
      away: res.awayTeam,
      stadium: res.stadiumInfo,
      date: res.date,
      status: res.status,
      score: res.score,
      winner: res.win
        ? res.win == res.homeTeam.id
          ? res.homeTeam
          : res.awayTeam
        : 0,
    }));

    return schedules;
  }
}
