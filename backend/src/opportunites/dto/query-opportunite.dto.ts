import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class QueryOpportuniteDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filtrer par statut (ouvert, ferme, expire)',
  })
  @IsOptional()
  @IsString()
  statut?: string;

  @ApiPropertyOptional({ description: 'Filtrer par ID de type' })
  @IsOptional()
  @IsString()
  typeId?: string;

  @ApiPropertyOptional({ description: 'Filtrer par ID de partenaire' })
  @IsOptional()
  @IsString()
  partenaireId?: string;

  @ApiPropertyOptional({
    description: 'Recherche textuelle dans le titre et la description',
  })
  @IsOptional()
  @IsString()
  q?: string;
}
