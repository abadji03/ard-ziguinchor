import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreateOpportuniteDto {
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

  @IsString()
  @IsNotEmpty()
  typeId: string;

  @IsOptional()
  @IsString()
  organisme?: string;

  @IsOptional()
  @IsString()
  secteur?: string;

  @IsOptional()
  @IsDateString()
  dateLimite?: string;

  @IsOptional()
  @IsString()
  statut?: string;

  @IsOptional()
  @IsString()
  conditions?: string;

  @IsOptional()
  @IsString()
  documentId?: string;

  @IsOptional()
  @IsString()
  siteWeb?: string;

  @IsOptional()
  @IsString()
  lienExterne?: string;
}
