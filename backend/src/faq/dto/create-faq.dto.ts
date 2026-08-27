import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateFaqDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsString()
  @IsNotEmpty()
  reponse: string;

  @IsOptional()
  @IsString()
  categorieId?: string;

  @IsOptional()
  @IsNumber()
  ordre?: number;
}
