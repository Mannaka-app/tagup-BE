import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CurrentUserId } from 'src/common/decorators/current-user-id.decorator';
import {
  getAllRoomsDocs,
  getMessagesDocs,
  getMyRoomsDocs,
  uploadChatImageDocs,
} from './docs/chat.docs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetMessagesDto } from './dto/getMessages.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Chat')
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

  @Get(':roomId/messages')
  @getMessagesDocs.ApiOperation
  @getMessagesDocs.ApiParam
  @getMessagesDocs.ApiQuery1
  @getMessagesDocs.ApiQuery2
  @getMessagesDocs.ApiResponse
  async GetMessagesDto(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Query() getMessagesDto: GetMessagesDto,
  ) {
    return await this.chatService.getMessages(roomId, getMessagesDto);
  }

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  @uploadChatImageDocs.ApiOperation
  @uploadChatImageDocs.ApiConsumes
  @uploadChatImageDocs.ApiBody
  @uploadChatImageDocs.ApiResponse
  async uploadChatImage(@UploadedFile() file: Express.Multer.File) {
    return await this.chatService.uploadChatImage(file);
  }
}
