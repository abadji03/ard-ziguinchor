import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class QueryMembreDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Recherche textuelle dans le nom, prénom et fonction',
  })
  @IsOptional()
  @IsString()
  q?: string;
}
