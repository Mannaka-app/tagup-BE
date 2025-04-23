import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { CheerService } from 'src/modules/cheer/cheer.service';

@WebSocketGateway({ namespace: '/chat', cors: { origin: '*' } })
export class ChatGateway {
  constructor(
    private readonly chatService: ChatService,
    private readonly prisma: PrismaService,
    private readonly cheerService: CheerService,
  ) {}

  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log(client.handshake.query);
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

      console.log('새로운 채팅방 생성', room);

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
    const { roomId } = payload;

    const isJoined = await this.prisma.roomUsers.findFirst({
      where: { userId, roomId },
    });

    let messages;
    const room = await this.prisma.rooms.findUnique({
      where: { id: payload.roomId },
    });

    if (isJoined) {
      client.join(room.id.toString());
      messages = await this.chatService.getRecentMessages(userId, roomId);
    } else {
      await this.prisma.roomUsers.create({
        data: { userId, roomId: payload.roomId },
      });

      client.join(room.id.toString());
    }

    console.log(`${userId}유저 ${room.id} 채팅방 참여`);
    client.emit('roomJoined', { room, messages });
  }

  @SubscribeMessage('message')
  async handleMessage(
    client: Socket,
    payload: { roomId: number; content: string },
  ) {
    const userId = Number(client.handshake.query.userId);

    const message = await this.chatService.createMessage(
      userId,
      payload.roomId,
      payload.content,
    );

    // 같은 방에 있는 유저에게 메시지 브로드캐스트
    this.server.to(payload.roomId.toString()).emit('message', message);
  }

  @SubscribeMessage('joinCheerRoom')
  async handleJoinCheerRoom(client: Socket, payload: { roomId: number }) {
    const userId = Number(client.handshake.query.userId);
    const { roomId } = payload;

    client.join(payload.roomId.toString());
    console.log(`${userId}번 유저 ${roomId}번 응원톡방 참여`);

    const data = await this.cheerService.getCheerRoomMessages(roomId, 0);
    client.emit('cheerRoomJoined', { messages: data.messages });
  }

  @SubscribeMessage('cheerMessage')
  async handleCheerMesssage(
    client: Socket,
    payload: { roomId: number; content: string },
  ) {
    const userId = Number(client.handshake.query.userId);

    const message = await this.chatService.createMessage(
      userId,
      payload.roomId,
      payload.content,
    );

    // 같은 방에 있는 유저에게 메시지 브로드캐스트
    this.server.to(payload.roomId.toString()).emit('message', message);
  }

  @SubscribeMessage('leaveCheerRoom')
  async handleLeaveCheerRoom(client: Socket, payload: { roomId: number }) {
    const userId = Number(client.handshake.query.userId);
    const { roomId } = payload;

    client.leave(roomId.toString());
    console.log(`${userId}번 유저 ${roomId}번 응원톡방 퇴장`);

    client.emit('cheerRoomLeft', { roomId });
  }
}
