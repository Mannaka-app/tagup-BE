import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FeedsService } from './feeds.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateFeedDto } from './dto/createFeed.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CurrentUserId } from 'src/common/decorators/current-user-id.decorator';
import {
  createFeedCommentDocs,
  createFeedDocs,
  deleteFeedDocs,
  getFeedCommentsDocs,
  getFeedsDocs,
  uploadFeedImageDocs,
} from './docs/feeds.docs';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('feeds')
export class FeedsController {
  constructor(private readonly feedsService: FeedsService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  @uploadFeedImageDocs.ApiOperation
  @uploadFeedImageDocs.ApiConsumes
  @uploadFeedImageDocs.ApiBody
  @uploadFeedImageDocs.ApiResponse
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return await this.feedsService.uploadFeedImage(file);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @createFeedDocs.ApiOperation
  @createFeedDocs.ApiBody
  @createFeedDocs.ApiResponse
  async createFeed(
    @CurrentUserId() userId: number,
    @Body() createFeedDto: CreateFeedDto,
  ) {
    return await this.feedsService.createFeed(userId, createFeedDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @getFeedsDocs.ApiOperation
  @getFeedsDocs.ApiResponse
  async getFeeds(@CurrentUserId() userId: number) {
    return await this.feedsService.getFeeds(userId);
  }

  @Post(':feedId/comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @createFeedCommentDocs.ApiOperation
  @createFeedCommentDocs.ApiParam
  @createFeedCommentDocs.ApiBody
  @createFeedCommentDocs.ApiResponse
  async createFeedComment(
    @CurrentUserId() userId: number,
    @Param('feedId', ParseIntPipe) feedId: number,
    @Body() data: { content: string },
  ) {
    return await this.feedsService.createFeedComment(
      userId,
      feedId,
      data.content,
    );
  }

  @Get(':feedId/comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @getFeedCommentsDocs.ApiOperation
  @getFeedCommentsDocs.ApiParam
  @getFeedCommentsDocs.ApiResponse
  async getFeedComments(@Param('feedId') feedId: number) {
    return await this.feedsService.getFeedComments(feedId);
  }

  @Delete(':feedId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @deleteFeedDocs.ApiOperation
  @deleteFeedDocs.ApiParam
  @deleteFeedDocs.ApiResponse
  async deleteFeed(
    @CurrentUserId() userId: number,
    @Param('feedId', ParseIntPipe) feedId: number,
  ) {
    return await this.feedsService.deleteFeed(feedId, userId);
  }
}
