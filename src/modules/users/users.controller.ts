import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserDetailDto } from './dto/userDetail.dto';
import {
  deleteProfileImageDocs,
  getAllTeamsDocs,
  inactivateUserDocs,
  setUserDetailDocs,
  setUserTeamDocs,
  updateProfileImageDocs,
  uploadProfileImageDocs,
} from './docs/users.docs';
import { ApiBearerAuth } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUserId } from 'src/common/decorators/current-user-id.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 유저 추가 정보 설정 (닉네임, 성별)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @setUserDetailDocs.ApiOperation
  @setUserDetailDocs.ApiBody
  @setUserDetailDocs.ApiResponse
  @Post('detail')
  async setUserDetail(
    @CurrentUserId() userId: number,
    @Body() userDetailDto: UserDetailDto,
  ) {
    return await this.usersService.setUserDetail(userId, userDetailDto);
  }

  // 전체 팀 데이터 불러오기
  @getAllTeamsDocs.ApiOperation
  @getAllTeamsDocs.ApiResponse
  @Get('teams')
  async getAllteams() {
    return await this.usersService.getAllTeams();
  }

  // 유저 응원 팀 설정
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @setUserTeamDocs.ApiOperation
  @setUserTeamDocs.ApiBody
  @setUserTeamDocs.ApiResponse
  @Post('teams')
  async setUserTeam(@CurrentUserId() userId: number, @Body() data) {
    return await this.usersService.setUserTeam(userId, data.teamId);
  }

  // 유저 프로필 사진 등록
  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  @uploadProfileImageDocs.ApiOperation
  @uploadProfileImageDocs.ApiConsumes
  @uploadProfileImageDocs.ApiBody
  @uploadProfileImageDocs.ApiResponse
  async uploadProfileImage(@UploadedFile() file: Express.Multer.File) {
    return await this.usersService.uploadProfileImage(file);
  }

  // 프로필 사진 변경
  @UseGuards(JwtAuthGuard)
  @Put('profile-image')
  @ApiBearerAuth()
  @updateProfileImageDocs.ApiOperation
  @updateProfileImageDocs.ApiBody
  @updateProfileImageDocs.ApiResponse
  async updateProfileImage(
    @CurrentUserId() userId: number,
    @Body() data: { profileUrl: string },
  ) {
    return await this.usersService.updateProfileImage(userId, data.profileUrl);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('profile-image')
  @ApiBearerAuth()
  @deleteProfileImageDocs.ApiOperation
  @deleteProfileImageDocs.ApiResponse
  async deleteProfileImage(@CurrentUserId() userId: number) {
    return await this.usersService.deleteProfileImage(userId);
  }

  @Delete(':userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @inactivateUserDocs.ApiOperation
  @inactivateUserDocs.ApiParam
  @inactivateUserDocs.ApiResponse
  async inactivateUser(@Param('userId') userId: number) {
    return await this.usersService.inactivateUser(userId);
  }
}
