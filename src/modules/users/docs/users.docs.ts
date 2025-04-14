import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

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
          active: '계정 활성화 여부',
          teams: {
            id: '팀 id',
            name: '팀 이름',
            color: '팀 컬러',
            emoji: '팀 이모지',
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
          active: '계정 활성화 여부',
          teams: {
            id: '팀 id',
            name: '팀 이름',
            color: '팀 컬러',
            emoji: '팀 이모지',
          },
        },
      },
    },
  }),
};

export const uploadProfileImageDocs = {
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

export const updateProfileImageDocs = {
  ApiOperation: ApiOperation({
    summary: '유저 프로필 사진 변경',
  }),
  ApiBody: ApiBody({
    description: '사진 url',
    schema: {
      type: 'object',
      properties: {
        profileUrl: { type: 'string', description: 'string' },
      },
    },
  }),
  ApiResponse: ApiResponse({
    status: 200,
    description: '프로필 사진 변경 완료',
    schema: {
      example: {
        success: true,
        message: '프로필 사진 변경이 완료됐습니다.',
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
          teams: {
            id: '팀 id',
            name: '팀 이름',
            color: '팀 컬러',
            emoji: '팀 이모지',
          },
        },
      },
    },
  }),
};

export const deleteProfileImageDocs = {
  ApiOperation: ApiOperation({
    summary: '유저 프로필 사진 삭제',
    description: '기본 프로필 이미지로 변경됩니다.',
  }),
  ApiResponse: ApiResponse({
    status: 200,
    description: '프로필 사진 삭제 완료',
    schema: {
      example: {
        success: true,
        message: '프로필 사진이 삭제되었습니다.',
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
          teams: {
            id: '팀 id',
            name: '팀 이름',
            color: '팀 컬러',
            emoji: '팀 이모지',
          },
        },
      },
    },
  }),
};

export const inactivateUserDocs = {
  ApiOperation: ApiOperation({
    summary: '회원 탈퇴',
    description: '회원 정보를 비활성화 처리합니다.',
  }),

  ApiParam: ApiParam({
    name: 'userId',
    required: true,
    type: Number,
    description: '탈퇴할 유저 ID',
  }),

  ApiResponse: ApiResponse({
    status: 200,
    description: '회원 탈퇴 성공',
    schema: {
      example: {
        success: true,
        message: '회원 탈퇴가 완료되었습니다.',
      },
    },
  }),
};
