import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class QueryContenuDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Nature du bloc (MISSION, JALON, …)' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ description: 'Page / emplacement consommateur' })
  @IsOptional()
  @IsString()
  section?: string;

  @ApiPropertyOptional({ description: 'Ne renvoyer que les blocs actifs' })
  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  actif?: boolean;

  @ApiPropertyOptional({
    description: "Admin : inclure aussi les blocs masqués (actif = false)",
  })
  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  includeInactifs?: boolean;

  @ApiPropertyOptional({ description: 'Recherche dans le titre et la description' })
  @IsOptional()
  @IsString()
  q?: string;
}
