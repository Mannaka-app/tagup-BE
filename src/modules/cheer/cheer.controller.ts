import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { CheerService } from './cheer.service';
import {
  getCheerRoomMessagesDocs,
  getTeamCheerTalkDocs,
} from './docs/cheer.doc';
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

  @Get(':teamId/messages')
  @getCheerRoomMessagesDocs.ApiOperation
  @getCheerRoomMessagesDocs.ApiParam
  @getCheerRoomMessagesDocs.ApiQuery
  @getCheerRoomMessagesDocs.ApiResponse
  async getTeamMessages(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Query('cursor', ParseIntPipe) cursor: number,
  ) {
    return await this.cheerService.getCheerRoomMessages(teamId, cursor);
  }
}
