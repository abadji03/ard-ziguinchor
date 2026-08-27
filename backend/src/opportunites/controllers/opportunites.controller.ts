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
import { OpportunitesService } from '../services/opportunites.service';
import { CreateOpportuniteDto } from '../dto/create-opportunite.dto';
import { QueryOpportuniteDto } from '../dto/query-opportunite.dto';
import { Public } from '../../auth/decorators/public.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Opportunités')
@Controller('opportunites')
export class OpportunitesController {
  constructor(private readonly opportunitesService: OpportunitesService) {}

  // ─── Lecture publique ───────────────────────────────────────────────────────

  @Public()
  @Get()
  @ApiOperation({ summary: 'Liste paginée des opportunités avec filtres' })
  findAll(@Query() query: QueryOpportuniteDto) {
    return this.opportunitesService.findAll(query);
  }

  @Public()
  @Get('slug/:slug')
  @ApiOperation({ summary: 'Récupérer une opportunité par son slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.opportunitesService.findBySlug(slug);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une opportunité par son ID' })
  findOne(@Param('id') id: string) {
    return this.opportunitesService.findOne(id);
  }

  // ─── Écriture protégée ──────────────────────────────────────────────────────

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR, Role.REDACTEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer une opportunité' })
  create(@Body() createDto: CreateOpportuniteDto) {
    return this.opportunitesService.create(createDto);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR, Role.REDACTEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier une opportunité' })
  update(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateOpportuniteDto>,
  ) {
    return this.opportunitesService.update(id, updateData);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer une opportunité' })
  remove(@Param('id') id: string) {
    return this.opportunitesService.remove(id);
  }
}
