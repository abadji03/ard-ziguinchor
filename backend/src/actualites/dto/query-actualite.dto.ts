import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class QueryActualiteDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Filtrer par statut (brouillon, publie, archive)' })
  @IsOptional()
  @IsString()
  statut?: string;

  @ApiPropertyOptional({ description: 'Filtrer par ID de catégorie' })
  @IsOptional()
  @IsString()
  categorieId?: string;

  @ApiPropertyOptional({ description: 'Recherche textuelle dans le titre et le résumé' })
  @IsOptional()
  @IsString()
  q?: string;
}
