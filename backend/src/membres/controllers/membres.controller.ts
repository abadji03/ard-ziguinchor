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
import { MembresService } from '../services/membres.service';
import { CreateMembreDto } from '../dto/create-membre.dto';
import { QueryMembreDto } from '../dto/query-membre.dto';
import { Public } from '../../auth/decorators/public.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Membres')
@Controller('membres')
export class MembresController {
  constructor(private readonly membresService: MembresService) {}

  // ─── Lecture publique ───────────────────────────────────────────────────────

  @Public()
  @Get()
  @ApiOperation({ summary: 'Liste paginée des membres' })
  findAll(@Query() query: QueryMembreDto) {
    return this.membresService.findAll(query);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un membre par son ID' })
  findOne(@Param('id') id: string) {
    return this.membresService.findOne(id);
  }

  // ─── Écriture protégée ──────────────────────────────────────────────────────

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR, Role.REDACTEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un membre' })
  create(@Body() dto: CreateMembreDto) {
    return this.membresService.create(dto);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR, Role.REDACTEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier un membre' })
  update(@Param('id') id: string, @Body() data: Partial<CreateMembreDto>) {
    return this.membresService.update(id, data);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un membre' })
  remove(@Param('id') id: string) {
    return this.membresService.remove(id);
  }
}
