import { ApiOperation, ApiResponse } from '@nestjs/swagger';

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
          },
        ],
      },
    },
  }),
};
