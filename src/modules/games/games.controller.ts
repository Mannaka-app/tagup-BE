import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { GameService } from './games.service';
import { ApiTags } from '@nestjs/swagger';
import { getWeeklyGameScheduleDocs } from './docs/game.docs';

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
  async getTeamSchedules(@Param('teamId', ParseIntPipe) teamId: number) {
    return await this.gameService.getTeamSchedules(teamId);
  }
}
