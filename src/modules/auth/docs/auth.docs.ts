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
          active: '계정 활성화 여부',
          isNew: '신규 가입 여부',
          teams: {
            id: '팀 id',
            name: '팀 이름',
            color: '팀 컬러',
            emoji: '팀 이모지',
          },
        },
        accessToken: '액세스 토큰',
        refreshToken: '리프레시 토큰',
      },
    },
  }),
};

export const refreshTokenDocs = {
  ApiOperation: ApiOperation({
    summary: '리프레시 토큰 재발급',
    description:
      'AccessToken 만료 시 RefreshToken으로 새로운 토큰을 발급받습니다.',
  }),

  ApiBody: ApiBody({
    schema: {
      example: {
        userId: '유저 아이디',
        refreshToken: '리프레시 토큰 값',
      },
    },
  }),

  ApiResponse: ApiResponse({
    status: 200,
    description: '토큰 재발급 성공',
    schema: {
      example: {
        accessToken: '새로 발급된 accessToken',
        refreshToken: '새로 발급된 refreshToken',
      },
    },
  }),
};
