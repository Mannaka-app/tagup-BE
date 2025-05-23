import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { GameService } from './games.service';
import { ApiTags } from '@nestjs/swagger';
import {
  getMonthlySchedulesDocs,
  getTeamRankDocs,
  getTeamSchedulesDocs,
  getWeeklyGameScheduleDocs,
} from './docs/game.docs';

@ApiTags('Game')
@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('week')
  @getWeeklyGameScheduleDocs.ApiOperation
  @getWeeklyGameScheduleDocs.ApiResponse
  async getWeeklyGameSchedules() {
    return await this.gameService.getWeeklyGameSchedules();
  }

  @Get('team/:teamId')
  @getTeamSchedulesDocs.ApiOperation
  @getTeamSchedulesDocs.ApiParam
  @getTeamSchedulesDocs.ApiResponse
  async getTeamSchedules(@Param('teamId', ParseIntPipe) teamId: number) {
    return await this.gameService.getTeamSchedules(teamId);
  }

  @Get('month/:month')
  @getMonthlySchedulesDocs.ApiOperation
  @getMonthlySchedulesDocs.ApiParam
  @getMonthlySchedulesDocs.ApiResponse
  async getMonthlyGameSchedules(@Param('month', ParseIntPipe) month: number) {
    return await this.gameService.getMonthlyGameSchedules(month, 2025);
  }

  @Get('rank')
  @getTeamRankDocs.ApiOperation
  @getTeamRankDocs.ApiResponse
  async getTeamRank() {
    return await this.gameService.getTeamRank();
  }
}
