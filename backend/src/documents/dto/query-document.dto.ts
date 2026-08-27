import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { TypePlanification } from './create-document.dto';

export class QueryDocumentDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filtrer par statut (brouillon, publie, archive)',
  })
  @IsOptional()
  @IsString()
  statut?: string;

  @ApiPropertyOptional({ description: 'Filtrer par ID de catégorie' })
  @IsOptional()
  @IsString()
  categorieId?: string;

  @ApiPropertyOptional({
    description: 'Filtrer par format (pdf, docx, xlsx...)',
  })
  @IsOptional()
  @IsString()
  format?: string;

  @ApiPropertyOptional({ description: 'Filtrer par langue' })
  @IsOptional()
  @IsString()
  langue?: string;

  @ApiPropertyOptional({ description: 'Filtrer par ID de projet' })
  @IsOptional()
  @IsString()
  projetId?: string;

  @ApiPropertyOptional({ description: 'Filtrer par ID de programme' })
  @IsOptional()
  @IsString()
  programmeId?: string;

  @ApiPropertyOptional({ description: 'Filtrer par ID de partenaire' })
  @IsOptional()
  @IsString()
  partenaireId?: string;

  @ApiPropertyOptional({
    description:
      'Filtrer par type de planification (REGIONALE, TERRITORIALE, AUTRE)',
  })
  @IsOptional()
  @IsEnum(TypePlanification)
  typePlanification?: TypePlanification;

  @ApiPropertyOptional({
    description: 'Filtrer par sous-type (PDC, PDD, PLD, PIC, Schema...)',
  })
  @IsOptional()
  @IsString()
  sousType?: string;

  @ApiPropertyOptional({ description: 'Filtrer par ID de département' })
  @IsOptional()
  @IsString()
  departementId?: string;

  @ApiPropertyOptional({ description: "Filtrer par ID d'arrondissement" })
  @IsOptional()
  @IsString()
  arrondissementId?: string;

  @ApiPropertyOptional({ description: 'Filtrer par ID de commune' })
  @IsOptional()
  @IsString()
  communeId?: string;

  @ApiPropertyOptional({
    description: 'Recherche textuelle dans le titre et le résumé',
  })
  @IsOptional()
  @IsString()
  q?: string;
}
