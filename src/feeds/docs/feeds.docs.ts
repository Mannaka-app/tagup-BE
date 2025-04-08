import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

export const uploadFeedImageDocs = {
  ApiOperation: ApiOperation({
    summary: '피드 이미지 업로드',
    description:
      '피드 작성 시 사용할 이미지를 업로드합니다. 이미지 URL을 반환합니다.',
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
        imageUrl:
          'https://tagup-images.s3.ap-northeast-2.amazonaws.com/feed/abc123.jpg',
      },
    },
  }),
};

export const createFeedDocs = {
  ApiOperation: ApiOperation({
    summary: '피드 작성',
    description:
      '피드를 작성합니다. 텍스트, 태그, 이미지 URL을 포함할 수 있습니다.',
  }),

  ApiBody: ApiBody({
    description: '작성할 피드 정보',
    schema: {
      type: 'object',
      properties: {
        content: {
          type: 'string',
          example: '직관 인증합니다!',
          description: '피드 내용',
        },
        imageUrls: {
          type: 'array',
          items: {
            type: 'string',
          },
          example: [
            'https://tagup-images.s3.ap-northeast-2.amazonaws.com/feed/abc.jpg',
          ],
          description: '업로드한 이미지 URL 배열',
        },
      },
    },
  }),

  ApiResponse: ApiResponse({
    status: 201,
    description: '피드 작성 성공',
    schema: {
      example: {
        success: true,
        message: '피드 등록이 완료됐습니다.',
      },
    },
  }),
};

export const getFeedsDocs = {
  ApiOperation: ApiOperation({
    summary: '피드 전체 조회',
    description: '유저 팀 기준으로 전체 피드를 조회합니다.',
  }),

  ApiResponse: ApiResponse({
    status: 200,
    description: '피드 조회 성공',
    schema: {
      example: {
        feed: [
          {
            id: '피드 아이디',
            userId: '작성한 유저 아이디',
            userTeamId: '유저가 응원하는 팀 ID',
            nickName: '유저 닉네임',
            profileUrl: '유저 프로필 이미지',
            userLevel: '유저 레벨',
            content: '피드 내용',
            createdAt: '피드 작성 시간',
            images: ['피드 이미지1', '피드 이미지2'],
            comments: '댓글 수',
            likes: '좋아요 수',
            isLiked: '내가 좋아요 눌렀는지 여부',
          },
        ],
      },
    },
  }),
};

export const createFeedCommentDocs = {
  ApiOperation: ApiOperation({
    summary: '댓글 작성',
    description: '피드에 댓글을 작성합니다.',
  }),
  ApiParam: ApiParam({
    name: 'feedId',
    required: true,
    description: '댓글을 작성할 피드의 ID',
    type: Number,
  }),
  ApiBody: ApiBody({
    description: '댓글 내용',
    schema: {
      type: 'object',
      properties: {
        content: {
          type: 'string',
          example: '직관 재밌었어요!',
        },
      },
    },
  }),
  ApiResponse: ApiResponse({
    status: 201,
    description: '댓글 작성 성공',
    schema: {
      example: {
        success: true,
        message: '댓글이 등록되었습니다.',
      },
    },
  }),
};

export const getFeedCommentsDocs = {
  ApiOperation: ApiOperation({
    summary: '피드 댓글 조회',
    description: '피드 ID를 통해 해당 피드의 댓글 목록을 조회합니다.',
  }),

  ApiParam: ApiParam({
    name: 'feedId',
    type: Number,
    required: true,
    description: '조회할 피드의 ID',
  }),

  ApiResponse: ApiResponse({
    status: 200,
    description: '피드 개별 조회 성공',
    schema: {
      example: {
        comment: [
          {
            id: '댓글 ID',
            userId: '댓글 작성자 유저 ID',
            nickName: '댓글 작성자 닉네임',
            profileUrl: '댓글 작성자 프로필 이미지 URL',
            userLevel: '댓글 작성자 레벨',
            content: '댓글 내용',
            createdAt: '댓글 작성 일시',
          },
        ],
      },
    },
  }),
};

export const deleteFeedDocs = {
  ApiOperation: ApiOperation({
    summary: '피드 삭제',
    description: '해당 피드를 삭제합니다. 작성자 본인만 삭제할 수 있습니다.',
  }),

  ApiParam: ApiParam({
    name: 'feedId',
    type: Number,
    description: '삭제할 피드의 ID',
    example: 1,
  }),

  ApiResponse: ApiResponse({
    status: 200,
    description: '피드 삭제 성공',
    schema: {
      example: {
        success: true,
        message: '피드가 삭제되었습니다.',
      },
    },
  }),
};
