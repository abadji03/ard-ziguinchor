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
import { PartenairesService } from '../services/partenaires.service';
import { CreatePartenaireDto } from '../dto/create-partenaire.dto';
import { QueryPartenaireDto } from '../dto/query-partenaire.dto';
import { Public } from '../../auth/decorators/public.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Partenaires')
@Controller('partenaires')
export class PartenairesController {
  constructor(private readonly partenairesService: PartenairesService) {}

  // ─── Lecture publique ───────────────────────────────────────────────────────

  @Public()
  @Get()
  @ApiOperation({ summary: 'Liste paginée des partenaires avec filtres' })
  findAll(@Query() query: QueryPartenaireDto) {
    return this.partenairesService.findAll(query);
  }

  @Public()
  @Get('slug/:slug')
  @ApiOperation({ summary: 'Récupérer un partenaire par son slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.partenairesService.findBySlug(slug);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un partenaire par son ID' })
  findOne(@Param('id') id: string) {
    return this.partenairesService.findOne(id);
  }

  // ─── Écriture protégée ──────────────────────────────────────────────────────

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR, Role.REDACTEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un partenaire' })
  create(@Body() createPartenaireDto: CreatePartenaireDto) {
    return this.partenairesService.create(createPartenaireDto);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR, Role.REDACTEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier un partenaire' })
  update(
    @Param('id') id: string,
    @Body() updateData: Partial<CreatePartenaireDto>,
  ) {
    return this.partenairesService.update(id, updateData);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un partenaire' })
  remove(@Param('id') id: string) {
    return this.partenairesService.remove(id);
  }
}
