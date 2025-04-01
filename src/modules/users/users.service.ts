import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Gender } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async setUserDetail(user, data) {
    const { userId } = user;

    const exist = await this.prisma.users.findUnique({
      where: { id: userId },
    });

    if (!exist) {
      throw new UnauthorizedException('등록되지 않은 유저입니다.');
    }

    try {
      const gender: Gender =
        data.gender == 'MALE' ? Gender.MALE : Gender.FEMALE;

      await this.prisma.users.update({
        where: { id: userId },
        data: {
          nickname: data.nickname,
          gender: gender,
        },
      });

      return { success: true, message: '성별 및 닉네임 설정이 완료됐습니다.' };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('서버에서 오류가 발생했습니다.');
    }
  }

  async getAllTeams() {
    return await this.prisma.teams.findMany({ where: { id: { gt: 0 } } });
  }
}
