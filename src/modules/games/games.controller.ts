import { Controller, Get } from '@nestjs/common';
import { GameService } from './games.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Game')
@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('schedule')
  async getGameSchedules() {
    return await this.gameService.getGameSchedules();
  }
}
