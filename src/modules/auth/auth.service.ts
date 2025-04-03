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
import * as jwksClient from 'jwks-rsa';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  private jwksClient = jwksClient({
    jwksUri: 'https://kauth.kakao.com/.well-known/jwks.json',
    cache: true,
    rateLimit: true,
  });

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly redis: RedisService,
  ) {}

  async register(registerDto: RegisterDto) {
    const exist = await this.prisma.users.findFirst({
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
      const user = await this.prisma.users.findFirst({
        where: { email: loginDto.email },
      });

      if (!user) throw new UnauthorizedException('계정이 존재하지 않습니다.');

      const validPassword = await bcrypt.compare(
        loginDto.password,
        user.password,
      );

      if (validPassword) {
        const jwtTokens = await this.generateTokens(user.id);

        await this.redis.set(
          `refresh:${user.id}`,
          jwtTokens.refresh,
          60 * 60 * 24 * 7,
        );

        return {
          success: true,
          message: '로그인에 성공했습니다',
          user,
          accessToken: jwtTokens.access,
          refreshToken: jwtTokens.refresh,
        };
      } else {
        throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
      }
    } catch (err) {
      if (err instanceof UnauthorizedException) throw err;
      throw new InternalServerErrorException('서버에서 오류가 발생했습니다.');
    }
  }

  // 카카오 idToken 디코딩
  async kakaoIdTokenDecode(data: { idToken: string }) {
    try {
      const { idToken } = data;
      const decodedHeader = jwt.decode(idToken, {
        complete: true,
      }) as jwt.Jwt;
      const kid = decodedHeader.header.kid;

      const key = await this.jwksClient.getSigningKey(kid);
      const publicKey = key.getPublicKey();

      const payload = jwt.verify(idToken, publicKey, {
        algorithms: ['RS256'],
        issuer: 'https://kauth.kakao.com',
      }) as jwt.JwtPayload;

      const kakaoId = payload.sub;
      return kakaoId;
    } catch (err) {
      console.error('Kakao ID token verification failed:', err);
      throw new UnauthorizedException('Invalid Kakao idToken');
    }
  }

  // 카카오 로그인 처리
  async kakaoLogin(idToken) {
    const sub = await this.kakaoIdTokenDecode(idToken);

    let user = await this.prisma.users.findUnique({
      where: { sub },
      include: { teams: true },
    });

    if (!user) {
      user = await this.prisma.users.create({
        data: { sub, authProvider: 'Kakao' },
        include: { teams: true },
      });
    }

    const jwtTokens = await this.generateTokens(user.id);

    await this.redis.set(
      `refresh:${user.id}`,
      jwtTokens.refresh,
      60 * 60 * 24 * 7,
    );

    return {
      success: true,
      message: '카카오 로그인이 완료됐습니다',
      user,
      accessToken: jwtTokens.access,
      refreshToken: jwtTokens.refresh,
    };
  }

  // 엑세스/리프레시 토큰 생성
  async generateTokens(userId) {
    const access = this.jwt.sign(
      { userId: userId },
      {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '15m',
      },
    );

    const refresh = this.jwt.sign(
      { userId: userId },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      },
    );

    return { access, refresh };
  }
}
