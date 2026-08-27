import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateIndicateurDto {
  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  valeur: number;

  @IsString()
  @IsNotEmpty()
  unite: string;

  @IsNumber()
  @IsNotEmpty()
  annee: number;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  secteurId?: string;

  @IsOptional()
  @IsString()
  communeId?: string;

  @IsOptional()
  @IsString()
  departementId?: string;
}
