import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class QueryFaqDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Filtrer par ID de catégorie' })
  @IsOptional()
  @IsString()
  categorieId?: string;

  @ApiPropertyOptional({
    description: 'Recherche textuelle dans la question et la réponse',
  })
  @IsOptional()
  @IsString()
  q?: string;
}
