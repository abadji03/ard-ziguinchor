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
import { ProjetsService } from '../services/projets.service';
import { CreateProjetDto } from '../dto/create-projet.dto';
import { QueryProjetDto } from '../dto/query-projet.dto';
import { Public } from '../../auth/decorators/public.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Projets')
@Controller('projets')
export class ProjetsController {
  constructor(private readonly projetsService: ProjetsService) {}

  // ─── Lecture publique ───────────────────────────────────────────────────────

  @Public()
  @Get()
  @ApiOperation({ summary: 'Liste paginée des projets avec filtres' })
  findAll(@Query() query: QueryProjetDto) {
    return this.projetsService.findAll(query);
  }

  @Public()
  @Get('slug/:slug')
  @ApiOperation({ summary: 'Récupérer un projet par son slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.projetsService.findBySlug(slug);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un projet par son ID' })
  findOne(@Param('id') id: string) {
    return this.projetsService.findOne(id);
  }

  // ─── Écriture protégée ──────────────────────────────────────────────────────

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR, Role.REDACTEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un projet' })
  create(@Body() createProjetDto: CreateProjetDto) {
    return this.projetsService.create(createProjetDto);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR, Role.REDACTEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier un projet' })
  update(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateProjetDto>,
  ) {
    return this.projetsService.update(id, updateData);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un projet' })
  remove(@Param('id') id: string) {
    return this.projetsService.remove(id);
  }
}
