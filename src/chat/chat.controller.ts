import { Controller, Get, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CurrentUserId } from 'src/common/decorators/current-user-id.decorator';
import { getAllRoomsDocs, getMyRoomsDocs } from './docs/chat.docs';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  @getAllRoomsDocs.ApiOperation
  @getAllRoomsDocs.ApiResponse
  async getAllRooms() {
    return await this.chatService.getAllRooms();
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @getMyRoomsDocs.ApiOperation
  @getMyRoomsDocs.ApiResponse
  async getMyRooms(@CurrentUserId() userId: number) {
    return await this.chatService.getMyRooms(userId);
  }
}
