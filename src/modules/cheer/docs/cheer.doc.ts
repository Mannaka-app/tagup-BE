import { ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';

export const getTeamCheerTalkDocs = {
  ApiOperation: ApiOperation({
    summary: '팀별 응원톡방 조회',
    description: '특정 팀에 해당하는 응원톡방 정보를 조회합니다.',
  }),

  ApiParam: ApiParam({
    name: 'teamId',
    type: Number,
    required: true,
    description: '팀 ID',
  }),

  ApiResponse: ApiResponse({
    status: 200,
    description: '응원톡방 조회 성공',
    schema: {
      example: {
        success: true,
        cheerRoom: {
          id: '채팅방 아이디',
          teamId: '팀 아이디',
          title: '채팅방 제목(팀 이름)',
          thumnailUrl: '팀 로고 url',
        },
        lastCursor: '무한 스크롤 용 커서',
      },
    },
  }),
};

export const getCheerRoomMessagesDocs = {
  ApiOperation: ApiOperation({
    summary: '응원톡방 메세지 조회',
    description: '특정 응원톡방의 메세지를 무한스크롤 방식으로 조회합니다.',
  }),

  ApiParam: ApiParam({
    name: 'teamId',
    required: true,
    type: Number,
    description: '응원팀의 ID',
  }),

  ApiQuery: ApiQuery({
    name: 'cursor',
    required: false,
    type: Number,
    description: '마지막으로 받은 메세지 ID (기본값: 0)',
  }),

  ApiResponse: ApiResponse({
    status: 200,
    description: '응원톡방 메세지 조회 성공',
    schema: {
      example: {
        success: true,
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
        lastCursor: '무한 스크롤용 커서 값',
      },
    },
  }),
};
