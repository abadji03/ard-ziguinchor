import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class QueryGalerieDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Recherche textuelle dans le nom et la description',
  })
  @IsOptional()
  @IsString()
  q?: string;
}
