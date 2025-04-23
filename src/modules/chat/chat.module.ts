import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { CheerService } from 'src/modules/cheer/cheer.service';

@Module({
  providers: [ChatGateway, ChatService, CheerService],
  controllers: [ChatController],
})
export class ChatModule {}
