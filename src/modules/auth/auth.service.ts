import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(registerDto: RegisterDto) {
    const exist = await this.prisma.users.findUnique({
      where: { email: registerDto.email },
    });

    if (exist) {
      throw new ConflictException('이미 등록된 이메일입니다.');
    }
    try {
      await this.prisma.users.create({
        data: {
          name: registerDto.name,
          email: registerDto.email,
          password: registerDto.password,
          authProvider: 'Tagup',
        },
      });

      return { success: true, message: '회원가입이 완료되었습니다.' };
    } catch (error) {
      console.error('회원가입 중 오류 발생:', error);
      throw new InternalServerErrorException('서버에서 오류가 발생했습니다.');
    }
  }
}
