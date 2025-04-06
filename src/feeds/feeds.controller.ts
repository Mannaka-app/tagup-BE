import { Controller, Get } from '@nestjs/common';
import { FeedsService } from './feeds.service';

@Controller('feeds')
export class FeedsController {
  constructor(private readonly feedsService: FeedsService) {}

  @Get('tags')
  async getAllTags() {
    return await this.feedsService.getAllTags();
  }
}
