import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserDetailDto } from './dto/userDetail.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Post('detail')
  async setUserDetail(@Req() req, @Body() userDetailDto: UserDetailDto) {
    return await this.usersService.setUserDetail(req.user, userDetailDto);
  }

  @Get('teams')
  async getAllteams() {
    return await this.usersService.getAllTeams();
  }

  @UseGuards(JwtAuthGuard)
  @Post('teams')
  async setUserTeam(@Req() req, @Body() data) {
    return await this.usersService.setUserTeam(req.user, data.teamId);
  }
}
