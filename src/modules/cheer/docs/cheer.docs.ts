import {
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';

export const createCheerTalkDocs = {
  ApiOperation: ApiOperation({
    summary: '응원 등록',
    description: '응원 내용을 등록합니다.',
  }),

  ApiBearerAuth: ApiBearerAuth(),

  ApiBody: ApiBody({
    description: '응원 내용',
    schema: {
      type: 'object',
      properties: {
        content: { type: 'string', example: '힘내자 우리 팀!' },
      },
      required: ['content'],
    },
  }),

  ApiResponse: ApiResponse({
    status: 201,
    description: '응원 등록 성공',
    schema: {
      example: {
        success: true,
        message: '응원 등록이 완료됐습니다.',
      },
    },
  }),
};

export const getCheerTalksDocs = {
  ApiOperation: ApiOperation({
    summary: '응원 목록 조회',
    description: '응원 글들을 최신순으로 조회합니다.',
  }),

  ApiBearerAuth: ApiBearerAuth(),

  ApiQuery1: ApiQuery({
    name: 'cursor',
    required: false,
    type: Number,
    description: '이전 커서 ID',
  }),

  ApiQuery2: ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: '불러올 개수 (기본 10)',
  }),

  ApiResponse: ApiResponse({
    status: 200,
    description: '응원 목록 조회 성공',
    schema: {
      example: [
        {
          id: '응원 id',
          userId: '작성한 유저 id',
          nickname: '유저 닉네임',
          profileUrl: '유저 프로필 url',
          userLevel: '유저 레벨',
          content: '응원 내용',
          createdAt: '작성 일자',
          likes: 0,
        },
        {
          id: '응원 id',
          userId: '작성한 유저 id',
          nickname: '유저 닉네임',
          profileUrl: '유저 프로필 url',
          userLevel: '유저 레벨',
          content: '응원 내용',
          createdAt: '작성 일자',
          likes: 0,
        },
      ],
    },
  }),
};
