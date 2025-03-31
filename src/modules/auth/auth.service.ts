import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(registerDto: RegisterDto) {
    await this.prisma.test.create({
      data: {
        name: registerDto.name,
        email: registerDto.email,
        password: registerDto.password,
      },
    });

    return { success: true, message: '회원가입이 완료되었습니다.' };
  }
}
