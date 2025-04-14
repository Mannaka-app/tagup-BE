import {
  IsArray,
  IsNotEmpty,
  IsString,
  ArrayNotEmpty,
  IsString as IsStringEach,
} from 'class-validator';

export class CreateFeedDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsStringEach({ each: true })
  imageUrls: string[];
}
