import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CheerService } from './cheer.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUserId } from 'src/common/decorators/current-user-id.decorator';
import { PaginationQueryDto } from './dto/paginationQuery.dto';
import {
  likesHanderDocs,
  createCheerTalkDocs,
  getCheerTalksDocs,
} from './docs/cheer.docs';

@Controller('cheer')
export class CheerController {
  constructor(private readonly cheerService: CheerService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @createCheerTalkDocs.ApiOperation
  @createCheerTalkDocs.ApiBearerAuth
  @createCheerTalkDocs.ApiBody
  @createCheerTalkDocs.ApiResponse
  async createCheerTalk(
    @Body() data: { content: string },
    @CurrentUserId() userId: number,
  ) {
    return await this.cheerService.createCheerTalk(userId, data.content);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @getCheerTalksDocs.ApiOperation
  @getCheerTalksDocs.ApiBearerAuth
  @getCheerTalksDocs.ApiQuery1
  @getCheerTalksDocs.ApiQuery2
  @getCheerTalksDocs.ApiResponse
  async getCheerTalks(
    @CurrentUserId() userId: number,
    @Query() paginationQueryDto: PaginationQueryDto,
  ) {
    return await this.cheerService.getCheerTalks(userId, paginationQueryDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('likes')
  @likesHanderDocs.ApiOperation
  @likesHanderDocs.ApiBearerAuth
  @likesHanderDocs.ApiBody
  @likesHanderDocs.ApiResponseAdd
  @likesHanderDocs.ApiResponseRemove
  async likesHandler(
    @CurrentUserId() userId: number,
    @Body() data: { cheerTalkId: number },
  ) {
    return await this.cheerService.likesHander(userId, data.cheerTalkId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteCheerTalk(
    @CurrentUserId() userId: number,
    @Body() data: { cheerTalkId: number },
  ) {
    return await this.cheerService.deleteCheerTalk(userId, data.cheerTalkId);
  }
}
