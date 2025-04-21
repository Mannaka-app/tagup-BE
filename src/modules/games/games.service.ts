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

    const schedules = this.scheduleFormat(result);

    return { success: true, schedules };
  }

  async getTeamSchedules(teamId: number) {
    const result = await this.prisma.gameSchedule.findMany({
      where: { OR: [{ home: teamId }, { away: teamId }] },
      orderBy: { date: 'asc' },
      include: {
        homeTeam: true,
        awayTeam: true,
        stadiumInfo: true,
      },
    });

    const schedules = this.scheduleFormat(result);

    return { success: true, schedules };
  }

  async getMonthlyGameSchedules(month: number, year: number) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    const result = await this.prisma.gameSchedule.findMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
      },
      include: {
        homeTeam: true,
        awayTeam: true,
        stadiumInfo: true,
      },
      orderBy: { date: 'asc' },
    });

    const schedules = this.scheduleFormat(result);

    return { success: true, schedules };
  }

  scheduleFormat(result) {
    result.map((res) => ({
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

    return result;
  }

  async getTeamStandings() {
    const standings = await this.prisma.teamStandings.findMany({
      orderBy: { rank: 'asc' },
      include: {
        team: {
          select: {
            name: true,
            badge: true,
          },
        },
      },
    });

    return {
      success: true,
      message: '구단 순위 조회에 성공했습니다.',
      standings: standings.map((s) => ({
        rank: s.rank,
        teamId: s.teamId,
        teamName: s.team.name,
        badge: s.team.badge,
        gamesPlayed: s.gamesPlayed,
        wins: s.wins,
        losses: s.losses,
        draws: s.draws,
        winRate: s.winRate,
      })),
    };
  }
}
