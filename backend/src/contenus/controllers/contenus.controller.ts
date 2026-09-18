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
import { ContenusService } from '../services/contenus.service';
import { CreateContenuDto } from '../dto/create-contenu.dto';
import { QueryContenuDto } from '../dto/query-contenu.dto';
import { Public } from '../../auth/decorators/public.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Contenus éditoriaux')
@Controller('contenus')
export class ContenusController {
  constructor(private readonly contenusService: ContenusService) {}

  // ─── Lecture publique ───────────────────────────────────────────────────────

  @Public()
  @Get()
  @ApiOperation({ summary: 'Liste paginée des contenus éditoriaux' })
  findAll(@Query() query: QueryContenuDto) {
    return this.contenusService.findAll(query);
  }

  /** Regroupement par type pour une page donnée (accueil, a-propos, la-region…). */
  @Public()
  @Get('section/:section')
  @ApiOperation({ summary: "Contenus actifs d'une section, regroupés par type" })
  findBySection(@Param('section') section: string) {
    return this.contenusService.findBySection(section);
  }

  @Public()
  @Get('type/:type')
  @ApiOperation({ summary: "Contenus actifs d'un type donné" })
  findByType(@Param('type') type: string, @Query('section') section?: string) {
    return this.contenusService.findByType(type, section);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un contenu éditorial par son ID' })
  findOne(@Param('id') id: string) {
    return this.contenusService.findOne(id);
  }

  // ─── Écriture protégée ──────────────────────────────────────────────────────

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un contenu éditorial' })
  create(@Body() dto: CreateContenuDto) {
    return this.contenusService.create(dto);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier un contenu éditorial' })
  update(@Param('id') id: string, @Body() data: Partial<CreateContenuDto>) {
    return this.contenusService.update(id, data);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un contenu éditorial' })
  remove(@Param('id') id: string) {
    return this.contenusService.remove(id);
  }
}
