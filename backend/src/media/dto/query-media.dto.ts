import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class QueryMediaDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filtrer par type (image, video, document)',
  })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ description: 'Filtrer par format (jpg, png, pdf...)' })
  @IsOptional()
  @IsString()
  format?: string;

  @ApiPropertyOptional({
    description: 'Recherche textuelle dans le nom et la légende',
  })
  @IsOptional()
  @IsString()
  q?: string;
}
