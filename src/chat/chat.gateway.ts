import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: '/chat', cors: { origin: '*' } })
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log('유저 연결됨 :', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('❌ 연결 해제됨:', client.id);
  }
}
