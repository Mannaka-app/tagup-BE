import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

export const setUserDetailDocs = {
  ApiOperation: ApiOperation({
    summary: '유저 추가정보 설정 (닉네임, 성별)',
  }),
  ApiBody: ApiBody({
    description: '유저의 닉네임과 성별',
    schema: {
      type: 'object',
      properties: {
        nickname: { type: 'string', description: '유저 닉네임' },
        gender: {
          type: 'string',
          description: '유저 성별(MALE|FEMALE)',
        },
      },
    },
  }),
  ApiResponse: ApiResponse({
    status: 201,
    description: '유저 추가 정보 설정 완료',
    schema: {
      example: {
        success: true,
        message: '성별 및 닉네임 설정이 완료됐습니다',
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
          teams: {
            id: '팀 id',
            name: '팀 이름',
            color: '팀 컬러',
            emogi: '팀 이모지',
          },
        },
      },
    },
  }),
};

export const getAllTeamsDocs = {
  ApiOperation: ApiOperation({
    summary: '전체 팀 데이터 불러오기',
  }),
  ApiResponse: ApiResponse({
    schema: {
      example: [
        {
          id: '팀 아이디',
          name: '팀 이름',
          color: '팀 컬러',
          emoji: '팀 이모지',
        },
        {
          id: '팀 아이디',
          name: '팀 이름',
          color: '팀 컬러',
          emoji: '팀 이모지',
        },
      ],
    },
  }),
};

export const setUserTeamDocs = {
  ApiOperation: ApiOperation({
    summary: '유저 응원 팀 설정',
  }),
  ApiBody: ApiBody({
    description: '응원하는 팀 아이디',
    schema: {
      type: 'object',
      properties: {
        teamId: { type: 'number', description: '팀 아이디' },
      },
    },
  }),
  ApiResponse: ApiResponse({
    status: 201,
    description: '응원 팀 설정 완료',
    schema: {
      example: {
        success: true,
        message: '응원 팀 설정이 완료됐습니다',
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
          teams: {
            id: '팀 id',
            name: '팀 이름',
            color: '팀 컬러',
            emogi: '팀 이모지',
          },
        },
      },
    },
  }),
};
