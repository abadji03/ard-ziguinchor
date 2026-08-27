import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class QueryPartenaireDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filtrer par statut (actif, inactif)',
  })
  @IsOptional()
  @IsString()
  statut?: string;

  @ApiPropertyOptional({ description: 'Filtrer par ID de type de partenaire' })
  @IsOptional()
  @IsString()
  typeId?: string;

  @ApiPropertyOptional({ description: 'Filtrer par pays' })
  @IsOptional()
  @IsString()
  pays?: string;

  @ApiPropertyOptional({
    description: 'Recherche textuelle dans le nom et la description',
  })
  @IsOptional()
  @IsString()
  q?: string;
}
