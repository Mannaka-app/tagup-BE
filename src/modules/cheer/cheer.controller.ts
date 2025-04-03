import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CheerService } from './cheer.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUserId } from 'src/common/decorators/current-user-id.decorator';

@Controller('cheer')
export class CheerController {
  constructor(private readonly cheerService: CheerService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createCheerTalk(
    @Body() data: { content: string },
    @CurrentUserId() userId: number,
  ) {
    return await this.cheerService.createCheerTalk(userId, data.content);
  }
}
