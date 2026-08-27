import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEnum,
} from 'class-validator';

export enum TypePlanification {
  REGIONALE = 'REGIONALE',
  TERRITORIALE = 'TERRITORIALE',
  AUTRE = 'AUTRE',
}

export class CreateDocumentDto {
  @IsString()
  @IsNotEmpty()
  titre: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  fichier: string;

  @IsString()
  @IsNotEmpty()
  format: string;

  @IsOptional()
  @IsEnum(TypePlanification)
  typePlanification?: TypePlanification;

  @IsOptional()
  @IsString()
  sousType?: string;

  @IsOptional()
  @IsString()
  resume?: string;

  @IsOptional()
  @IsString()
  auteur?: string;

  @IsOptional()
  @IsString()
  datePublication?: string;

  @IsOptional()
  @IsNumber()
  taille?: number;

  @IsOptional()
  @IsNumber()
  nombrePages?: number;

  @IsOptional()
  @IsString()
  langue?: string;

  @IsOptional()
  @IsString()
  version?: string;

  @IsOptional()
  @IsString()
  statut?: string;

  @IsOptional()
  @IsString()
  categorieId?: string;

  @IsOptional()
  @IsString()
  projetId?: string;

  @IsOptional()
  @IsString()
  programmeId?: string;

  @IsOptional()
  @IsString()
  partenaireId?: string;

  @IsOptional()
  @IsString()
  departementId?: string;

  @IsOptional()
  @IsString()
  arrondissementId?: string;

  @IsOptional()
  @IsString()
  communeId?: string;
}
