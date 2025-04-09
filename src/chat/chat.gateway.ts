import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';

@WebSocketGateway({ namespace: '/chat', cors: { origin: '*' } })
export class ChatGateway {
  constructor(
    private readonly chatService: ChatService,
    private readonly prisma: PrismaService,
  ) {}

  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    const userId = Number(client.handshake.query.userId);
    console.log(`유저 연결됨 소켓: ${client.id} / 유저 아이디 : ${userId}`);
  }

  handleDisconnect(client: Socket) {
    console.log('❌ 연결 해제됨:', client.id);
  }

  // 채팅방 생성
  @SubscribeMessage('createRoom')
  async handleCreateRoom(client: Socket, payload: { title: string }) {
    const userId = Number(client.handshake.query.userId);
    let room;
    await this.prisma.$transaction(async (prisma) => {
      room = await prisma.rooms.create({
        data: { title: payload.title, createdAt: new Date() },
      });

      console.log(room);

      await prisma.roomUsers.create({
        data: { userId, roomId: room.id },
      });
    });

    client.join(room.id.toString());
    this.server.emit('roomCreated', room);
  }

  // 채팅방 참여
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(client: Socket, payload: { roomId: number }) {
    const userId = Number(client.handshake.query.userId);

    await this.prisma.roomUsers.create({
      data: { userId, roomId: payload.roomId },
    });

    console.log('새로운 유저 참여 db 저장');

    const room = await this.prisma.rooms.findUnique({
      where: { id: payload.roomId },
    });

    client.join(room.id.toString());

    console.log('새로운 유저 채팅방 참여');

    client.emit('roomJoined', room);
  }
}
