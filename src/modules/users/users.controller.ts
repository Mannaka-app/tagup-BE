import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
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
}
