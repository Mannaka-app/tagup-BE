import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CheerService } from './cheer.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUserId } from 'src/common/decorators/current-user-id.decorator';
import { PaginationQueryDto } from './dto/paginationQuery.dto';

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

  @UseGuards(JwtAuthGuard)
  @Get()
  async getCheerTalks(
    @CurrentUserId() userId: number,
    @Query() paginationQueryDto: PaginationQueryDto,
  ) {
    return await this.cheerService.getCheerTalks(userId, paginationQueryDto);
  }
}
