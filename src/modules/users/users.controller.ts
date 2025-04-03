import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserDetailDto } from './dto/userDetail.dto';
import {
  getAllTeamsDocs,
  setUserDetailDocs,
  setUserTeamDocs,
} from './docs/users.docs';
import { ApiBearerAuth } from '@nestjs/swagger';

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
  async setUserDetail(@Req() req, @Body() userDetailDto: UserDetailDto) {
    return await this.usersService.setUserDetail(req.user, userDetailDto);
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
  async setUserTeam(@Req() req, @Body() data) {
    return await this.usersService.setUserTeam(req.user, data.teamId);
  }
}
