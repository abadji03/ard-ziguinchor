import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsArray,
} from 'class-validator';

export class CreateProjetDto {
  @IsString()
  @IsNotEmpty()
  titre: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsString()
  resume?: string;

  @IsOptional()
  @IsString()
  objectifs?: string;

  @IsOptional()
  @IsString()
  resultats?: string;

  @IsString()
  @IsNotEmpty()
  secteurId: string;

  @IsOptional()
  @IsString()
  statut?: string;

  @IsOptional()
  @IsNumber()
  budget?: number;

  @IsOptional()
  @IsNumber()
  budgetExecute?: number;

  @IsOptional()
  @IsNumber()
  niveauAvancement?: number;

  @IsOptional()
  @IsString()
  devise?: string;

  @IsOptional()
  @IsString()
  dateDebut?: string;

  @IsOptional()
  @IsString()
  dateFin?: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsNumber()
  beneficiaires?: number;

  @IsOptional()
  @IsString()
  reference?: string;

  @IsOptional()
  @IsString()
  imagePrincipale?: string;

  @IsOptional()
  @IsString()
  departementId?: string;

  @IsOptional()
  @IsString()
  communeId?: string;

  @IsOptional()
  @IsString()
  documentId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  partenaireIds?: string[];

  @IsOptional()
  @IsString()
  partenairesRole?: string;
}
