import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { kakaoLoginDocs } from './docs/auth.docs';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Post('kakao/login')
  @ApiBearerAuth()
  @kakaoLoginDocs.ApiOperation
  @kakaoLoginDocs.ApiBody
  @kakaoLoginDocs.ApiResponse
  async kakaoLogin(@Body() idToken: any) {
    return await this.authService.kakaoLogin(idToken);
  }
}
