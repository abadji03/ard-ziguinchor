import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class QueryIndicateurDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Filtrer par ID de secteur' })
  @IsOptional()
  @IsString()
  secteurId?: string;

  @ApiPropertyOptional({ description: 'Filtrer par ID de commune' })
  @IsOptional()
  @IsString()
  communeId?: string;

  @ApiPropertyOptional({ description: 'Filtrer par ID de département' })
  @IsOptional()
  @IsString()
  departementId?: string;

  @ApiPropertyOptional({ description: 'Filtrer par ID de projet' })
  @IsOptional()
  @IsString()
  projetId?: string;

  @ApiPropertyOptional({ description: 'Filtrer par ID de programme' })
  @IsOptional()
  @IsString()
  programmeId?: string;

  @ApiPropertyOptional({ description: 'Filtrer par année' })
  @IsOptional()
  @IsString()
  annee?: string;

  @ApiPropertyOptional({
    description: 'Recherche textuelle dans le nom et la description',
  })
  @IsOptional()
  @IsString()
  q?: string;
}
