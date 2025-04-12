import { Controller, Get, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CurrentUserId } from 'src/common/decorators/current-user-id.decorator';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  async getAllRooms() {
    return await this.chatService.getAllRooms();
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  async getMyRooms(@CurrentUserId() userId: number) {
    return await this.chatService.getMyRooms(userId);
  }
}
