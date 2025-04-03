import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

export const kakaoLoginDocs = {
  ApiOperation: ApiOperation({
    summary: '카카오 Oauth 로그인',
  }),
  ApiBody: ApiBody({
    description: 'Oauth 로그인 시 발급된 idToken',
    schema: {
      type: 'object',
      properties: {
        idToken: {
          type: 'string',
          description: 'idToken',
        },
      },
    },
  }),
  ApiResponse: ApiResponse({
    status: 201,
    description: '카카오 로그인 성공',
    schema: {
      example: {
        success: true,
        message: '로그인에 성공했습니다',
        user: {
          id: '유저 아이디',
          email: '유저 이메일',
          password: '유저 비밀번호',
          sub: '유저 카카오 id',
          nickname: '유저 닉네임',
          authProvider: '사용한 Oauth',
          profileUrl: '프로필 url',
          gender: '성별',
          team: '응원 팀 id',
          createdAt: '가입 날짜',
          teamSeletedAt: '팀 설정 날짜',
          winningRate: '직관 승률',
          level: '유저 레벨',
        },
        accessToken: '액세스 토큰',
        refreshToken: '리프레시 토큰',
      },
    },
  }),
};
