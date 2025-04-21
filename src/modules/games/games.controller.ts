import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { GameService } from './games.service';
import { ApiTags } from '@nestjs/swagger';
import {
  getMonthlySchedulesDocs,
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

  @Get(':teamId')
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

  @Get('team/rank')
  async getTeamStandings() {
    return await this.gameService.getTeamStandings();
  }
}
