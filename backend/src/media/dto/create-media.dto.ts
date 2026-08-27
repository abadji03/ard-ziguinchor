import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';

export class CreateMediaDto {
  @IsString()
  @IsNotEmpty()
  nom!: string;

  @IsString()
  @IsNotEmpty()
  fichier!: string;

  @IsString()
  @IsNotEmpty()
  type!: string;

  @IsOptional()
  @IsString()
  format?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  taille?: number;

  @IsOptional()
  @IsInt()
  largeur?: number;

  @IsOptional()
  @IsInt()
  hauteur?: number;

  @IsOptional()
  @IsString()
  texteAlt?: string;

  @IsOptional()
  @IsString()
  legende?: string;

  @IsOptional()
  @IsString()
  credit?: string;

  @IsOptional()
  @IsInt()
  ordre?: number;
}
