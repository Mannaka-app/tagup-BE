import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly redis: RedisService,
  ) {}

  async register(registerDto: RegisterDto) {
    const exist = await this.prisma.users.findUnique({
      where: { email: registerDto.email },
    });

    if (exist) {
      throw new ConflictException('이미 등록된 이메일입니다.');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);
    try {
      await this.prisma.users.create({
        data: {
          name: registerDto.name,
          email: registerDto.email,
          password: hashedPassword,
          authProvider: 'Tagup',
        },
      });

      return { success: true, message: '회원가입이 완료되었습니다.' };
    } catch (error) {
      console.error('회원가입 중 오류 발생:', error);
      throw new InternalServerErrorException('서버에서 오류가 발생했습니다.');
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.prisma.users.findUnique({
        where: { email: loginDto.email },
      });

      if (!user) throw new UnauthorizedException('계정이 존재하지 않습니다.');

      const validPassword = await bcrypt.compare(
        loginDto.password,
        user.password,
      );

      if (validPassword) {
        const accessToken = this.jwt.sign(
          { userId: user.id },
          {
            secret: process.env.JWT_ACCESS_SECRET,
            expiresIn: '15m',
          },
        );

        const refreshToken = this.jwt.sign(
          { userId: user.id },
          {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: '7d',
          },
        );

        await this.redis.set(
          `refresh:${user.id}`,
          refreshToken,
          60 * 60 * 24 * 7,
        );

        return {
          success: true,
          message: '로그인에 성공했습니다',
          accessToken,
          refreshToken,
        };
      } else {
        throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
      }
    } catch (err) {
      if (err instanceof UnauthorizedException) throw err;
      throw new InternalServerErrorException('서버에서 오류가 발생했습니다.');
    }
  }
}
