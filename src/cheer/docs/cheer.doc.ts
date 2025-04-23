import { ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

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
      },
    },
  }),
};
