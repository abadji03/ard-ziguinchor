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
import { EvenementsService } from '../services/evenements.service';
import { CreateEvenementDto } from '../dto/create-evenement.dto';
import { QueryEvenementDto } from '../dto/query-evenement.dto';
import { Public } from '../../auth/decorators/public.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Événements')
@Controller('evenements')
export class EvenementsController {
  constructor(private readonly evenementsService: EvenementsService) {}

  // ─── Lecture publique ───────────────────────────────────────────────────────

  @Public()
  @Get()
  @ApiOperation({ summary: 'Liste paginée des événements avec filtres' })
  findAll(@Query() query: QueryEvenementDto) {
    return this.evenementsService.findAll(query);
  }

  @Public()
  @Get('slug/:slug')
  @ApiOperation({ summary: 'Récupérer un événement par son slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.evenementsService.findBySlug(slug);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un événement par son ID' })
  findOne(@Param('id') id: string) {
    return this.evenementsService.findOne(id);
  }

  // ─── Écriture protégée ──────────────────────────────────────────────────────

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR, Role.REDACTEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un événement' })
  create(@Body() createEvenementDto: CreateEvenementDto) {
    return this.evenementsService.create(createEvenementDto);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR, Role.REDACTEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier un événement' })
  update(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateEvenementDto>,
  ) {
    return this.evenementsService.update(id, updateData);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un événement' })
  remove(@Param('id') id: string) {
    return this.evenementsService.remove(id);
  }
}
