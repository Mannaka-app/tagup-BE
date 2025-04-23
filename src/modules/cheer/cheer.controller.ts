import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CheerService } from './cheer.service';
import { getTeamCheerTalkDocs } from './docs/cheer.doc';
import { ApiTags } from '@nestjs/swagger';

@Controller('cheer')
@ApiTags('Cheer')
export class CheerController {
  constructor(private readonly cheerService: CheerService) {}

  @Get(':teamId')
  @getTeamCheerTalkDocs.ApiOperation
  @getTeamCheerTalkDocs.ApiParam
  @getTeamCheerTalkDocs.ApiResponse
  async getTeamCheerTalk(@Param('teamId', ParseIntPipe) teamId: number) {
    return await this.cheerService.getTeamCheerTalk(teamId);
  }
}
