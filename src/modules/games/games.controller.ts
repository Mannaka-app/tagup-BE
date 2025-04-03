import { Controller, Get } from '@nestjs/common';
import { GameService } from './games.service';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('schedule')
  async getGameSchedules() {
    return await this.gameService.getGameSchedules();
  }
}
