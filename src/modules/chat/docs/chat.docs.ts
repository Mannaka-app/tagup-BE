import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

export const getAllRoomsDocs = {
  ApiOperation: ApiOperation({
    summary: '전체 채팅방 조회',
    description: '생성된 모든 채팅방을 조회합니다.',
  }),

  ApiResponse: ApiResponse({
    status: 200,
    description: '전체 채팅방 조회 성공',
    schema: {
      example: {
        success: true,
        message: '전체 채팅방 조회에 성공했습니다.',
        rooms: [
          {
            id: '채팅방 ID',
            title: '채팅방 제목',
            createAt: '채팅방 생성 일시',
            members: '채팅방 참여 인원 수',
            lastMessage: '마지막 채팅 시간 | 채팅내역 없을시 null',
          },
        ],
      },
    },
  }),
};

export const getMyRoomsDocs = {
  ApiOperation: ApiOperation({
    summary: '참여중인 채팅방 조회',
    description: '현재 로그인한 유저가 참여중인 채팅방을 조회합니다.',
  }),

  ApiResponse: ApiResponse({
    status: 200,
    description: '참여중인 채팅방 조회 성공',
    schema: {
      example: {
        success: true,
        message: '참여중인 채팅방 조회에 성공했습니다.',
        rooms: [
          {
            id: '채팅방 ID',
            title: '채팅방 제목',
            createAt: '채팅방 생성 일시',
            members: '채팅방 참여 인원 수',
            lastMessage: '마지막 채팅 시간 | 채팅내역 없을시 null',
          },
        ],
      },
    },
  }),
};

export const getMessagesDocs = {
  ApiOperation: ApiOperation({
    summary: '메세지 조회 / 기본 15개씩',
    description: '특정 채팅방(roomId)의 메세지를 조회합니다.',
  }),

  ApiParam: ApiParam({
    name: 'roomId',
    required: true,
    description: '채팅방 ID',
  }),

  ApiQuery1: ApiQuery({
    name: 'cursor',
    required: true,
    type: Number,
    description: '기준이 되는 메세지 ID',
  }),
  ApiQuery2: ApiQuery({
    name: 'direction',
    required: true,
    enum: ['up', 'down'],
    description: '조회 방향 (up: 위로, down: 아래로)',
  }),

  ApiResponse: ApiResponse({
    status: 200,
    description: '메세지 조회 성공',
    schema: {
      example: {
        success: true,
        message: '메세지 조회에 성공했습니다.',
        messages: [
          {
            id: '메세지 아이디',
            userId: '유저 아이디',
            nickname: '닉네임',
            profileUrl: '유저 프로필 url',
            content: '메세지 내용',
            createdAt: '메세지 시간',
          },
        ],
        firstCursor: 'up 스크롤 시 사용할 커서 값',
        lastCursor: 'down 스크롤 시 사용할 커서 값',
      },
    },
  }),
};

export const uploadChatImageDocs = {
  ApiOperation: ApiOperation({
    summary: '이미지 업로드',
    description: '이미지 업로드 시 이미지 링크를 반환합니다',
  }),

  ApiConsumes: ApiConsumes('multipart/form-data'),
  ApiBody: ApiBody({
    description: '업로드할 이미지 파일',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  }),

  ApiResponse: ApiResponse({
    status: 201,
    description: '이미지 업로드 성공',
    schema: {
      example: {
        success: true,
        imageUrl: '이미지 url',
      },
    },
  }),
};
