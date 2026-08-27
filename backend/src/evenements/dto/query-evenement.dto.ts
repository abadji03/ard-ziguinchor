import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class QueryEvenementDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filtrer par statut (a_venir, en_cours, termine, annule)',
  })
  @IsOptional()
  @IsString()
  statut?: string;

  @ApiPropertyOptional({ description: 'Filtrer par ID de programme' })
  @IsOptional()
  @IsString()
  programmeId?: string;

  @ApiPropertyOptional({ description: 'Filtrer par ID de projet' })
  @IsOptional()
  @IsString()
  projetId?: string;

  @ApiPropertyOptional({ description: 'Filtrer par ID de partenaire' })
  @IsOptional()
  @IsString()
  partenaireId?: string;

  @ApiPropertyOptional({
    description: 'Recherche textuelle dans le titre et le résumé',
  })
  @IsOptional()
  @IsString()
  q?: string;
}
