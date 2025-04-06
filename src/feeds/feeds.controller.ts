import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FeedsService } from './feeds.service';
import { FileInterceptor } from '@nestjs/platform-express';

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
}
