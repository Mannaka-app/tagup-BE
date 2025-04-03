import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CheerService } from './cheer.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('cheer')
export class CheerController {
  constructor(private readonly cheerService: CheerService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createCheerTalk(@Req() req, @Body() data) {
    return await this.cheerService.createCheerTalk(req.user, data.content);
  }
}
