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
import { ActualitesService } from '../services/actualites.service';
import { CreateActualiteDto } from '../dto/create-actualite.dto';
import { QueryActualiteDto } from '../dto/query-actualite.dto';
import { Public } from '../../auth/decorators/public.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Actualités')
@Controller('actualites')
export class ActualitesController {
  constructor(private readonly actualitesService: ActualitesService) {}

  // ─── Lecture publique ───────────────────────────────────────────────────────

  @Public()
  @Get()
  @ApiOperation({ summary: 'Liste paginée des actualités' })
  findAll(@Query() query: QueryActualiteDto) {
    return this.actualitesService.findAll(query);
  }

  @Public()
  @Get('slug/:slug')
  @ApiOperation({ summary: 'Récupérer une actualité par son slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.actualitesService.findBySlug(slug);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une actualité par son ID' })
  findOne(@Param('id') id: string) {
    return this.actualitesService.findOne(id);
  }

  // ─── Écriture protégée ──────────────────────────────────────────────────────

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR, Role.REDACTEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer une actualité' })
  create(@Body() createActualiteDto: CreateActualiteDto) {
    return this.actualitesService.create(createActualiteDto);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR, Role.REDACTEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier une actualité' })
  update(@Param('id') id: string, @Body() updateData: Partial<CreateActualiteDto>) {
    return this.actualitesService.update(id, updateData);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer une actualité' })
  remove(@Param('id') id: string) {
    return this.actualitesService.remove(id);
  }
}
