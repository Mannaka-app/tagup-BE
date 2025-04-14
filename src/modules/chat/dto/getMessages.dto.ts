import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber } from 'class-validator';

export enum Direction {
  UP = 'up',
  DOWN = 'down',
}

export class GetMessagesDto {
  @ApiProperty({
    description: '기준이 되는 메시지 ID (cursor)',
    example: 31,
  })
  @IsNumber()
  @Type(() => Number)
  cursor: number;

  @ApiProperty({
    description: '불러올 방향 (up: 과거, down: 최신)',
    example: 'up',
    enum: Direction,
  })
  @IsEnum(Direction)
  direction: Direction;
}
