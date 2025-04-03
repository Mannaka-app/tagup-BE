import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Gender } from '@prisma/client';
import { S3Service } from 'src/s3/s3.service';
import { UserDetailDto } from './dto/userDetail.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3: S3Service,
  ) {}

  // 유저 추가 정보 설정 (닉네임, 성별)
  async setUserDetail(userId: number, userDetailDto: UserDetailDto) {
    const exist = await this.getUserById(userId);
    if (!exist) {
      throw new UnauthorizedException('등록되지 않은 유저입니다.');
    }

    try {
      const gender: Gender =
        userDetailDto.gender == 'MALE' ? Gender.MALE : Gender.FEMALE;

      const user = await this.prisma.users.update({
        where: { id: userId },
        data: {
          nickname: userDetailDto.nickname,
          gender: gender,
        },
        include: { teams: true },
      });

      return {
        success: true,
        message: '성별 및 닉네임 설정이 완료됐습니다.',
        user,
      };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('서버에서 오류가 발생했습니다.');
    }
  }

  // 전체 팀 데이터 불러오기
  async getAllTeams() {
    return await this.prisma.teams.findMany({ where: { id: { gt: 0 } } });
  }

  // 유저 응원 팀 설정
  async setUserTeam(userId: number, teamId: number) {
    const exist = await this.getUserById(userId);
    if (!exist) {
      throw new UnauthorizedException('등록되지 않은 유저입니다.');
    }

    try {
      const user = await this.prisma.users.update({
        where: { id: userId },
        data: { team: teamId, teamSeletedAt: new Date() },
        include: { teams: true },
      });

      return { sucess: true, message: '응원 팀 설정이 완료됐습니다.', user };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('서버에서 오류가 발생했습니다.');
    }
  }

  async uploadProfileImage(file: Express.Multer.File) {
    const fileType = file.mimetype.split('/')[1];
    const imageUrl = await this.s3.uploadImage(
      8,
      file.buffer,
      fileType,
      'profile/',
    );

    return { success: true, imageUrl };
  }

  async getUserById(userId: number) {
    const user = await this.prisma.users.findUnique({ where: { id: userId } });

    return user;
  }

  async updateProfileImage(userId: number, profileUrl: string) {
    const user = await this.prisma.users.update({
      where: { id: userId },
      data: { profileUrl },
      include: { teams: true },
    });

    return { success: true, message: '프로필 사진 변경이 완료됐습니다.', user };
  }

  async deleteProfileImage(userId: number) {
    const user = await this.prisma.users.update({
      where: { id: userId },
      data: { profileUrl: process.env.DEFAULT_PROFILE_URL },
      include: { teams: true },
    });

    return { success: true, message: '프로필 사진이 삭제되었습니다.', user };
  }
}
