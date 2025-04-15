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
    } catch (error) {
      console.error('성별 닉네임 설정 중 오류 발생 ', error);
      throw new InternalServerErrorException('서버에서 오류가 발생했습니다.');
    }
  }

  // 전체 팀 데이터 불러오기
  async getAllTeams() {
    try {
      return await this.prisma.teams.findMany({ where: { id: { gt: 0 } } });
    } catch (error) {
      console.error('전체 팀 조회 중 오류 발생 ', error);
      throw new InternalServerErrorException('서버에서 오류가 발생했습니다.');
    }
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
    } catch (error) {
      console.error('응원 팀 설정 중 오류 발생 ', error);
      throw new InternalServerErrorException('서버에서 오류가 발생했습니다.');
    }
  }

  async uploadProfileImage(file: Express.Multer.File) {
    const imageUrl = await this.s3.uploadImageToS3(file, 'profile');
    return { success: true, imageUrl };
  }

  async getUserById(userId: number) {
    const user = await this.prisma.users.findUnique({ where: { id: userId } });

    return user;
  }

  async updateProfileImage(userId: number, profileUrl: string) {
    try {
      const user = await this.prisma.users.update({
        where: { id: userId },
        data: { profileUrl },
        include: { teams: true },
      });

      return {
        success: true,
        message: '프로필 사진 변경이 완료됐습니다.',
        user,
      };
    } catch (error) {
      console.error('프로필 사진 업데이트 중 오류 발생 ', error);
      throw new InternalServerErrorException('서버에서 오류가 발생했습니다.');
    }
  }

  async deleteProfileImage(userId: number) {
    try {
      const user = await this.prisma.users.update({
        where: { id: userId },
        data: { profileUrl: process.env.DEFAULT_PROFILE_URL },
        include: { teams: true },
      });

      return { success: true, message: '프로필 사진이 삭제되었습니다.', user };
    } catch (error) {
      console.error('프로필 사진 삭제 중 오류 발생 ', error);
      throw new InternalServerErrorException('서버에서 오류가 발생했습니다.');
    }
  }

  // 회원 탈퇴
  async inactivateUser(userId: number) {
    try {
      await this.prisma.$transaction(async (prisma) => {
        await prisma.users.update({
          where: { id: userId },
          data: {
            nickname: '탈퇴한 유저',
            profileUrl: process.env.DEFAULT_PROFILE_URL,
            team: 0,
            teamSeletedAt: null,
            winningRate: null,
            level: 0,
            password: null,
            gender: null,
            active: false,
            sub: null,
          },
        });

        await prisma.feeds.deleteMany({
          where: { userId },
        });
      });

      return { success: true, message: '회원 탈퇴가 완료되었습니다.' };
    } catch (error) {
      console.error('회원 탈퇴 중 오류 발생 ', error);
      throw new InternalServerErrorException('서버에서 오류가 발생했습니다.');
    }
  }
}
