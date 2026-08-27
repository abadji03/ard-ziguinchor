import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsDateString,
} from 'class-validator';

export class CreateActualiteDto {
  @IsString()
  @IsNotEmpty()
  titre: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  contenu: string;

  @IsOptional()
  @IsString()
  resume?: string;

  @IsOptional()
  @IsString()
  imagePrincipale?: string;

  @IsOptional()
  @IsString()
  statut?: string;

  @IsOptional()
  @IsDateString()
  datePublication?: string;

  @IsOptional()
  @IsString()
  categorieId?: string;

  @IsOptional()
  @IsArray()
  tags?: string[];
}
