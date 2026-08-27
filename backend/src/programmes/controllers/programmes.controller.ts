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
import { ProgrammesService } from '../services/programmes.service';
import { CreateProgrammeDto } from '../dto/create-programme.dto';
import { QueryProgrammeDto } from '../dto/query-programme.dto';
import { Public } from '../../auth/decorators/public.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Programmes')
@Controller('programmes')
export class ProgrammesController {
  constructor(private readonly programmesService: ProgrammesService) {}

  // ─── Lecture publique ───────────────────────────────────────────────────────

  @Public()
  @Get()
  @ApiOperation({ summary: 'Liste paginée des programmes avec filtres' })
  findAll(@Query() query: QueryProgrammeDto) {
    return this.programmesService.findAll(query);
  }

  @Public()
  @Get('slug/:slug')
  @ApiOperation({ summary: 'Récupérer un programme par son slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.programmesService.findBySlug(slug);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un programme par son ID' })
  findOne(@Param('id') id: string) {
    return this.programmesService.findOne(id);
  }

  // ─── Écriture protégée ──────────────────────────────────────────────────────

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR, Role.REDACTEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un programme' })
  create(@Body() createProgrammeDto: CreateProgrammeDto) {
    return this.programmesService.create(createProgrammeDto);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR, Role.REDACTEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier un programme' })
  update(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateProgrammeDto>,
  ) {
    return this.programmesService.update(id, updateData);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un programme' })
  remove(@Param('id') id: string) {
    return this.programmesService.remove(id);
  }
}
