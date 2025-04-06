import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ArrayNotEmpty,
  ArrayUnique,
  IsNumber,
  IsString as IsStringEach,
} from 'class-validator';

export class CreateFeedDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsNumber({}, { each: true })
  tagIds?: number[];

  @IsArray()
  @ArrayNotEmpty()
  @IsStringEach({ each: true })
  imageUrls: string[];
}
