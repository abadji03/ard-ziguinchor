import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class QueryProjetDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filtrer par statut (planifie, encours, realise, suspendu)',
  })
  @IsOptional()
  @IsString()
  statut?: string;

  @ApiPropertyOptional({ description: 'Filtrer par ID de secteur' })
  @IsOptional()
  @IsString()
  secteurId?: string;

  @ApiPropertyOptional({ description: 'Filtrer par ID de département' })
  @IsOptional()
  @IsString()
  departementId?: string;

  @ApiPropertyOptional({ description: 'Filtrer par ID de commune' })
  @IsOptional()
  @IsString()
  communeId?: string;

  @ApiPropertyOptional({ description: 'Filtrer par ID de programme' })
  @IsOptional()
  @IsString()
  programmeId?: string;

  @ApiPropertyOptional({ description: 'Filtrer par ID de partenaire' })
  @IsOptional()
  @IsString()
  partenaireId?: string;

  @ApiPropertyOptional({ description: 'Filtrer par année (ex: 2024)' })
  @IsOptional()
  @IsString()
  annee?: string;

  @ApiPropertyOptional({
    description: 'Recherche textuelle dans le titre et le résumé',
  })
  @IsOptional()
  @IsString()
  q?: string;
}
