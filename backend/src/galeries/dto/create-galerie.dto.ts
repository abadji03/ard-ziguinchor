import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateGalerieDto {
  @IsString()
  @IsNotEmpty()
  nom!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsNumber()
  ordre?: number;
}
