import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CheerService } from './cheer.service';

@Controller('cheer')
export class CheerController {
  constructor(private readonly cheerService: CheerService) {}

  @Get(':teamId')
  async getTeamCheerTalk(@Param('teamId', ParseIntPipe) teamId: number) {
    return await this.cheerService.getTeamCheerTalk(teamId);
  }
}
