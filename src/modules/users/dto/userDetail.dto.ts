import { IsEnum, IsString } from 'class-validator';
import { Gender } from '@prisma/client';

export class UserDetailDto {
  @IsString()
  nickname: string;

  @IsEnum(Gender, { message: '성별은 MALE 또는 FEMALE이어야 합니다.' })
  gender: Gender;
}
