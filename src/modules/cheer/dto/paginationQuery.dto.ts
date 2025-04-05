import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class PaginationQueryDto {
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  limit?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  cursor?: number;
}
