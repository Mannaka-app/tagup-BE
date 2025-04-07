import {
  Body,
  Controller,
  Get,
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

@Controller('feeds')
export class FeedsController {
  constructor(private readonly feedsService: FeedsService) {}

  @Get('tags')
  async getAllTags() {
    return await this.feedsService.getAllTags();
  }

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return await this.feedsService.uploadFeedImage(file);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createFeed(
    @CurrentUserId() userId: number,
    @Body() createFeedDto: CreateFeedDto,
  ) {
    return await this.feedsService.createFeed(userId, createFeedDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getFeeds(@CurrentUserId() userId: number) {
    return await this.feedsService.getFeeds(userId);
  }
}
