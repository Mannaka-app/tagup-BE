import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GameService {
  constructor(private readonly prisma: PrismaService) {}

  async getWeeklyGameSchedules() {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - now.getDay() + 1);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    const result = await this.prisma.gameSchedule.findMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
      },
      orderBy: { date: 'asc' },

      include: {
        homeTeam: true,
        awayTeam: true,
        stadiumInfo: true,
      },
    });

    const schedules = result.map((res) => ({
      id: res.id,
      date: res.date,
      home: {
        id: res.homeTeam.id,
        team: res.homeTeam.name,
        badge: res.homeTeam.badge,
        logo: res.homeTeam.logo,
        score: res.homeScore,
      },
      away: {
        id: res.awayTeam.id,
        team: res.awayTeam.name,
        badge: res.awayTeam.badge,
        logo: res.awayTeam.logo,
        score: res.awayScore,
      },
      stadium: {
        id: res.stadiumInfo.id,
        name: res.stadiumInfo.name,
        location: res.stadiumInfo.location,
      },
      status: res.status,
    }));

    return { success: true, schedules };
  }

  async getTeamSchedules(teamId: number) {
    const result = await this.prisma.gameSchedule.findMany({
      where: { OR: [{ home: teamId }, { away: teamId }] },
      orderBy: { date: 'asc' },
    });

    return result;
  }
}
