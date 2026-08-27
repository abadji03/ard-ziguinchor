import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class QueryProgrammeDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filtrer par statut (actif, termine, suspendu)',
  })
  @IsOptional()
  @IsString()
  statut?: string;

  @ApiPropertyOptional({ description: 'Filtrer par ID de partenaire' })
  @IsOptional()
  @IsString()
  partenaireId?: string;

  @ApiPropertyOptional({
    description: 'Recherche textuelle dans le nom et le résumé',
  })
  @IsOptional()
  @IsString()
  q?: string;
}
