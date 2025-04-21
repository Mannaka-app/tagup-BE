import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

export const getWeeklyGameScheduleDocs = {
  ApiOperation: ApiOperation({
    summary: '이번 주 경기 일정 조회',
    description:
      '이번 주(월~일) 사이에 열리는 KBO 정규 경기들의 일정과 정보를 반환합니다.',
  }),

  ApiResponse: ApiResponse({
    status: 200,
    description: '경기 일정 조회 성공',
    schema: {
      example: {
        success: true,
        schedules: [
          {
            id: '경기 ID',
            date: '경기 일시 (ISO 형식)',
            home: {
              id: '홈팀 ID',
              team: '홈팀 이름',
              badge: '홈팀 엠블럼 URL',
              logo: '홈팀 로고 URL',
              score: '홈팀 점수',
            },
            away: {
              id: '원정팀 ID',
              team: '원정팀 이름',
              badge: '원정팀 엠블럼 URL',
              logo: '원정팀 로고 URL',
              score: '원정팀 점수',
            },
            stadium: {
              id: '경기장 ID',
              name: '경기장 이름',
              location: '경기장 주소',
            },
            status: '경기 상태 (예: NS, FT, POST 등)',
          },
        ],
      },
    },
  }),
};

export const getTeamSchedulesDocs = {
  ApiOperation: ApiOperation({
    summary: '특정 팀 경기 일정 조회',
    description:
      '해당 팀의 홈경기 및 원정경기를 모두 포함한 전체 경기 일정을 조회합니다.',
  }),
  ApiParam: ApiParam({
    name: 'teamId',
    type: Number,
    description: '팀 ID (1~10)',
    example: 3,
  }),
  ApiResponse: ApiResponse({
    status: 200,
    description: '팀 경기 일정 조회 성공',
    schema: {
      example: {
        success: true,
        schedules: [
          {
            id: '경기 ID',
            date: '경기 일시 (ISO 형식)',
            home: {
              id: '홈팀 ID',
              team: '홈팀 이름',
              badge: '홈팀 엠블럼 URL',
              logo: '홈팀 로고 URL',
              score: '홈팀 점수',
            },
            away: {
              id: '원정팀 ID',
              team: '원정팀 이름',
              badge: '원정팀 엠블럼 URL',
              logo: '원정팀 로고 URL',
              score: '원정팀 점수',
            },
            stadium: {
              id: '경기장 ID',
              name: '경기장 이름',
              location: '경기장 주소',
            },
            status: '경기 상태 (예: NS, FT, POST 등)',
          },
        ],
      },
    },
  }),
};

export const getMonthlySchedulesDocs = {
  ApiOperation: ApiOperation({
    summary: '월별 경기 일정 조회',
    description:
      '요청한 월(month)의 전체 경기 일정을 조회합니다. (현재는 2025년 기준)',
  }),
  ApiParam: ApiParam({
    name: 'month',
    type: Number,
    example: 4,
    description: '조회할 월 (1~12)',
  }),
  ApiResponse: ApiResponse({
    status: 200,
    description: '월별 경기 일정 조회 성공',
    schema: {
      example: {
        success: true,
        schedules: [
          {
            id: '경기 ID',
            date: '경기 일시 (ISO 형식)',
            home: {
              id: '홈팀 ID',
              team: '홈팀 이름',
              badge: '홈팀 엠블럼 URL',
              logo: '홈팀 로고 URL',
              score: '홈팀 점수',
            },
            away: {
              id: '원정팀 ID',
              team: '원정팀 이름',
              badge: '원정팀 엠블럼 URL',
              logo: '원정팀 로고 URL',
              score: '원정팀 점수',
            },
            stadium: {
              id: '경기장 ID',
              name: '경기장 이름',
              location: '경기장 주소',
            },
            status: '경기 상태 (예: NS, FT, POST 등)',
          },
        ],
      },
    },
  }),
};

export const getTeamRankDocs = {
  ApiOperation: ApiOperation({
    summary: '구단 순위 조회',
    description: '현재 시즌의 KBO 구단 순위를 조회합니다.',
  }),

  ApiResponse: ApiResponse({
    status: 200,
    description: '구단 순위 조회 성공',
    schema: {
      example: {
        success: true,
        message: '구단 순위 조회에 성공했습니다.',
        standings: [
          {
            id: 1, // 레코드 ID
            teamId: 3, // 구단 ID
            rank: 1, // 순위
            gamesPlayed: 22, // 경기 수
            wins: 14, // 승
            losses: 6, // 패
            draws: 2, // 무
            winRate: 0.7, // 승률
          },
          {
            id: 2,
            teamId: 7,
            rank: 2,
            gamesPlayed: 22,
            wins: 13,
            losses: 7,
            draws: 2,
            winRate: 0.65,
          },
        ],
      },
    },
  }),
};
