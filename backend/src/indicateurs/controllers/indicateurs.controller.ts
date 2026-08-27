import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { IndicateursService } from '../services/indicateurs.service';
import { CreateIndicateurDto } from '../dto/create-indicateur.dto';
import { QueryIndicateurDto } from '../dto/query-indicateur.dto';
import { Public } from '../../auth/decorators/public.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Indicateurs')
@Controller('indicateurs')
export class IndicateursController {
  constructor(private readonly indicateursService: IndicateursService) {}

  // ─── Lecture publique ───────────────────────────────────────────────────────

  @Public()
  @Get()
  @ApiOperation({ summary: 'Liste paginée des indicateurs avec filtres' })
  findAll(@Query() query: QueryIndicateurDto) {
    return this.indicateursService.findAll(query);
  }

  @Public()
  @Get('secteur/:secteurId')
  @ApiOperation({ summary: 'Indicateurs par secteur' })
  getBySecteur(@Param('secteurId') secteurId: string) {
    return this.indicateursService.getBySecteur(secteurId);
  }

  @Public()
  @Get('commune/:communeId')
  @ApiOperation({ summary: 'Indicateurs par commune' })
  getByCommune(@Param('communeId') communeId: string) {
    return this.indicateursService.getByCommune(communeId);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un indicateur par son ID' })
  findOne(@Param('id') id: string) {
    return this.indicateursService.findOne(id);
  }

  // ─── Écriture protégée ──────────────────────────────────────────────────────

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR, Role.REDACTEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un indicateur' })
  create(@Body() createDto: CreateIndicateurDto) {
    return this.indicateursService.create(createDto);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR, Role.REDACTEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier un indicateur' })
  update(@Param('id') id: string, @Body() data: Partial<CreateIndicateurDto>) {
    return this.indicateursService.update(id, data);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un indicateur' })
  remove(@Param('id') id: string) {
    return this.indicateursService.remove(id);
  }
}
