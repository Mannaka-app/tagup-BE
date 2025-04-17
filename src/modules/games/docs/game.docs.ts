import { ApiOperation, ApiResponse } from '@nestjs/swagger';

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
