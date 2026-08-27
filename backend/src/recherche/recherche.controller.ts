import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RechercheService } from './recherche.service';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Recherche')
@Controller('recherche')
export class RechercheController {
  constructor(private readonly rechercheService: RechercheService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Recherche globale dans tout le contenu' })
  async search(@Query('q') query: string) {
    if (!query || query.length < 2) {
      return {
        message: 'La requête doit contenir au moins 2 caractères',
        results: [],
        total: 0,
      };
    }
    return this.rechercheService.searchAll(query);
  }
}
